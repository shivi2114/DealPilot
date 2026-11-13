import React from 'react';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function OrderSuccess({ order, onContinue, onMerchant }) {
  if (!order) return null;

  return (
    <main className="order-success-main">
      <div className="success-card-wrapper">
        <div className="success-icon-badge">✓</div>
        <span className="success-eyebrow">PAYMENT VERIFIED & ORDER CONFIRMED</span>
        <h1 className="success-heading">Thank you for your order!</h1>
        <p className="success-subheading">
          Your payment has been verified and your order has been transmitted directly to the merchant.
        </p>

        <div className="order-receipt-card">
          <div className="receipt-row">
            <div className="receipt-col">
              <span className="col-label">ORDER ID</span>
              <strong className="col-value highlight-id">{order.orderNumber || order.orderId}</strong>
            </div>
            <div className="receipt-col">
              <span className="col-label">PAYMENT STATUS</span>
              <strong className="col-value verified-status">✓ Confirmed & Verified</strong>
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-row">
            <div className="receipt-col">
              <span className="col-label">AMOUNT PAID</span>
              <strong className="col-value grand-paid">{formatMoney(order.amount)}</strong>
            </div>
            <div className="receipt-col">
              <span className="col-label">YOUR DEALPILOT SAVINGS</span>
              <strong className="col-value savings-won">
                {order.savings > 0 ? formatMoney(order.savings) : 'Best Price'}
              </strong>
            </div>
          </div>

          {order.customer && (
            <div className="receipt-shipping-summary">
              <span className="col-label">DELIVERING TO</span>
              <p className="shipping-address-text">
                <strong>{order.customer.name}</strong> · {order.customer.phone}<br />
                {order.customer.address}, {order.customer.city} - {order.customer.pincode}
              </p>
            </div>
          )}
        </div>

        <div className="success-dealpilot-banner">
          <span className="star-icon">✦</span>
          <div className="banner-text">
            <strong>Bargained with DealPilot AI Guardrails</strong>
            <p>
              Your order was settled at a negotiated price within merchant policy limits. You received merchant-backed guarantees and full buyer protection.
            </p>
          </div>
        </div>

        <div className="success-cta-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onContinue}
          >
            Explore More Products →
          </button>
          {onMerchant && (
            <button
              type="button"
              className="secondary-button"
              onClick={onMerchant}
            >
              View Order in Merchant Workspace ↗
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
