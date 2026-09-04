const crypto = require("crypto");
const Razorpay = require("razorpay");

function client() { return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }); }
async function createOrder(amount) { return client().orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt: `dealpilot_${Date.now()}_${crypto.randomBytes(3).toString("hex")}` }); }
function safeEqual(expected, received) { const expectedBuffer = Buffer.from(expected || ""); const receivedBuffer = Buffer.from(received || ""); return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer); }
function verifyPaymentSignature(orderId, paymentId, signature) { const digest = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(`${orderId}|${paymentId}`).digest("hex"); return safeEqual(digest, signature); }
function verifyWebhookSignature(rawBody, signature) { const digest = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "").update(rawBody).digest("hex"); return safeEqual(digest, signature); }
module.exports = { createOrder, verifyPaymentSignature, verifyWebhookSignature };
