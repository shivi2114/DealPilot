const express = require("express");
const { getProduct } = require("../data/products");
const { validateOffer } = require("../services/PolicyEngine");
const razorpay = require("../services/razorpayService");
const { appendRecord, readCollection } = require("../services/storageService");
const { recordAudit } = require("../services/auditService");

const router = express.Router();

router.post("/create-order", async (req, res, next) => {
  try {
    const { productId, amount, items } = req.body || {};

    let totalAmount = 0;
    let primaryProductId = productId;

    // Handle cart with multiple items
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const product = getProduct(item.productId || item.id);
        if (!product) {
          return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
        }
        const unitPrice = Number(item.offerPrice || item.price || product.originalPrice);
        const qty = Number(item.quantity) || 1;
        const decision = validateOffer({ offerPrice: unitPrice, freeShipping: false, freeGift: null }, product);
        if (!decision.allowed) {
          return res.status(400).json({ success: false, error: `${product.name}: ${decision.reason}` });
        }
        totalAmount += decision.offerPrice * qty;
      }
      primaryProductId = items[0].productId || items[0].id;
    } else {
      // Single product order
      const product = getProduct(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }
      const unitAmount = Number(amount);
      const decision = validateOffer({ offerPrice: unitAmount, freeShipping: false, freeGift: null }, product);
      if (!decision.allowed) {
        return res.status(400).json({ success: false, error: decision.reason });
      }
      totalAmount = decision.offerPrice;
    }

    recordAudit("PAYMENT_INITIATED", primaryProductId, "Payment order requested", { amount: totalAmount });

    const order = await razorpay.createOrder(totalAmount);
    appendRecord("payments", {
      razorpayOrderId: order.id,
      productId: primaryProductId,
      amount: totalAmount,
      status: "created",
      createdAt: new Date().toISOString()
    });

    recordAudit("ORDER_CREATED", primaryProductId, "Razorpay order created", { razorpayOrderId: order.id });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    next(error);
  }
});

router.post("/payment/verify", (req, res, next) => {
  try {
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      productId,
      amount,
      items,
      customer
    } = req.body || {};

    if (!orderId || !paymentId || !Number.isFinite(Number(amount))) {
      return res.status(400).json({ success: false, error: "Missing required payment fields" });
    }

    if (!razorpay.verifyPaymentSignature(orderId, paymentId, signature)) {
      recordAudit("PAYMENT_FAILED", productId || "cart", "Payment signature verification failed");
      return res.status(400).json({ success: false, error: "Payment signature verification failed" });
    }

    const payments = readCollection("payments");
    const prior = payments.find(p => (p.razorpayPaymentId === paymentId || p.razorpayOrderId === orderId) && p.status === "verified");
    if (prior) {
      return res.json({ success: true, verified: true, orderId: prior.orderId });
    }

    // Calculate total original amount and total savings
    let originalTotal = 0;
    let negotiatedTotal = Number(amount);
    let orderProductName = "DealPilot Order";
    let primaryProductId = productId;

    if (Array.isArray(items) && items.length > 0) {
      orderProductName = items.map(i => i.product?.name || i.name).join(", ");
      primaryProductId = items[0].product?.id || items[0].productId;
      originalTotal = items.reduce((sum, i) => sum + (i.product?.originalPrice || i.product?.price || i.price || 0) * (i.quantity || 1), 0);
    } else if (productId) {
      const product = getProduct(productId);
      if (product) {
        orderProductName = product.name;
        originalTotal = product.originalPrice;
      }
    }

    if (!originalTotal || originalTotal < negotiatedTotal) {
      originalTotal = negotiatedTotal;
    }

    const savings = Math.max(0, originalTotal - negotiatedTotal);
    const orderRecord = {
      orderId: `DP-${Date.now().toString().slice(-8)}`,
      productId: primaryProductId || "multi-product",
      productName: orderProductName,
      customer: customer || { name: "Alex Kumar", email: "alex@example.com" },
      negotiatedAmount: negotiatedTotal,
      originalAmount: originalTotal,
      savings,
      itemsCount: Array.isArray(items) ? items.reduce((s, i) => s + (i.quantity || 1), 0) : 1,
      customerAccepted: true,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      paymentStatus: "verified",
      createdAt: new Date().toISOString()
    };

    appendRecord("orders", orderRecord);
    appendRecord("payments", {
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      productId: primaryProductId || "multi-product",
      amount: negotiatedTotal,
      status: "verified",
      createdAt: orderRecord.createdAt
    });

    recordAudit("PAYMENT_VERIFIED", primaryProductId || "multi-product", "Payment signature verified", {
      orderId: orderRecord.orderId,
      amount: negotiatedTotal,
      savings
    });

    res.json({ success: true, verified: true, order: orderRecord });
  } catch (error) {
    next(error);
  }
});

router.post("/payment/webhook", (req, res, next) => {
  try {
    const signature = req.get("x-razorpay-signature");
    if (!process.env.RAZORPAY_WEBHOOK_SECRET || !razorpay.verifyWebhookSignature(req.body, signature)) {
      return res.status(400).json({ success: false, error: "Invalid webhook signature" });
    }
    const payload = JSON.parse(req.body.toString("utf8"));
    const eventId = req.get("x-razorpay-event-id") || payload.id;
    const existing = readCollection("payments").find(p => p.webhookEventId === eventId);
    recordAudit("PAYMENT_WEBHOOK_RECEIVED", payload.payload?.payment?.entity?.notes?.productId, "Razorpay webhook received", { eventId, event: payload.event });
    if (existing) return res.json({ success: true, duplicate: true });
    appendRecord("payments", {
      webhookEventId: eventId,
      event: payload.event,
      status: "webhook_received",
      createdAt: new Date().toISOString()
    });
    res.json({ success: true, received: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
