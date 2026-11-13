import React, { useState } from 'react';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function CheckoutPage({
  cart = [],
  total = 0,
  savings = 0,
  onBack,
  onPay,
  paymentLoading = false,
  error = ''
}) {
  const [formData, setFormData] = useState({
    name: 'Alex Kumar',
    email: 'alex@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    pincode: '560103'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentLoading) {
      onPay(formData);
    }
  };

  const originalSubtotal = total + savings;

  return (
    <main className="checkout-main-container">
      <div className="checkout-nav-bar">
        <button
          type="button"
          className="back-btn-pill"
          onClick={onBack}
          aria-label="Return to shopping bag"
        >
          ← Back to Bag
        </button>
        <span className="checkout-secure-badge">
          🔒 256-Bit SSL Encrypted Checkout
        </span>
      </div>

      <div className="checkout-grid-layout">
        {/* Left Column: Delivery & Payment Details Form */}
        <section className="checkout-form-panel">
          <div className="panel-header">
            <span className="panel-eyebrow">STEP 1 OF 2</span>
            <h2 className="panel-title">Shipping & Contact Details</h2>
            <p className="panel-sub">Enter the delivery address where your order will be delivered.</p>
          </div>

          <form onSubmit={handleSubmit} className="shipping-form-grid">
            <div className="form-field">
              <label htmlFor="customer-name">Full Name</label>
              <input
                id="customer-name"
                type="text"
                required
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Alex Kumar"
              />
            </div>

            <div className="form-field">
              <label htmlFor="customer-email">Email Address</label>
              <input
                id="customer-email"
                type="email"
                required
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="e.g. alex@example.com"
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="customer-phone">Phone Number (For dispatch updates)</label>
              <input
                id="customer-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="customer-address">Street Address / House No.</label>
              <input
                id="customer-address"
                type="text"
                required
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="House / Flat No., Apartment, Street, Landmark"
              />
            </div>

            <div className="form-field">
              <label htmlFor="customer-city">City</label>
              <input
                id="customer-city"
                type="text"
                required
                value={formData.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder="Bengaluru"
              />
            </div>

            <div className="form-field">
              <label htmlFor="customer-pincode">PIN Code</label>
              <input
                id="customer-pincode"
                type="text"
                required
                maxLength={6}
                value={formData.pincode}
                onChange={e => handleChange('pincode', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="560103"
              />
            </div>

            <div className="payment-gateway-card">
              <div className="gateway-header">
                <span className="gateway-brand">Razorpay Secure</span>
                <span className="gateway-tag">Official Partner</span>
              </div>
              <p className="gateway-desc">
                Pay using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), or NetBanking.
              </p>
              <div className="gateway-badges-row">
                <span className="method-pill">UPI</span>
                <span className="method-pill">Cards</span>
                <span className="method-pill">NetBanking</span>
                <span className="method-pill">Wallets</span>
              </div>
            </div>

            {error && (
              <div className="checkout-error-banner" role="alert">
                <span className="error-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="primary-button checkout-submit-btn"
              disabled={paymentLoading || !cart.length}
            >
              {paymentLoading ? (
                <span>Connecting to Secure Gateway...</span>
              ) : (
                <>
                  <span>Pay {formatMoney(total)} with Razorpay</span>
                  <span className="arrow">→</span>
                </>
              )}
            </button>

            <div className="checkout-fineprint">
              <span>🛡 Payment is held securely until dispatch. 7-day hassle-free refunds guaranteed.</span>
            </div>
          </form>
        </section>

        {/* Right Column: Order Summary */}
        <aside className="checkout-summary-panel" aria-label="Order Summary">
          <div className="summary-header">
            <h3>Order Summary</h3>
            <span className="items-count-badge">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <div className="summary-items-list">
            {cart.map(item => {
              const listPrice = item.product.price || item.product.originalPrice;
              const unitPrice = item.offer?.offerPrice || listPrice;
              const hasOffer = Boolean(item.offer?.offerPrice && item.offer.offerPrice < listPrice);

              return (
                <div key={item.product.id} className="summary-product-row">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="summary-product-img"
                  />
                  <div className="summary-product-details">
                    <strong className="summary-product-title">{item.product.name}</strong>
                    <div className="summary-qty-price">
                      <span>Qty: {item.quantity}</span>
                      <span className="dot">·</span>
                      <span>{formatMoney(unitPrice)} each</span>
                    </div>
                    {hasOffer && (
                      <span className="summary-deal-pill">
                        ✦ Negotiated deal: Save {formatMoney((listPrice - unitPrice) * item.quantity)}
                      </span>
                    )}
                    {hasOffer && item.offer?.freeGift && (
                      <span className="summary-gift-pill">
                        🎁 Gift: {item.offer.freeGift}
                      </span>
                    )}
                  </div>
                  <strong className="summary-line-total">
                    {formatMoney(unitPrice * item.quantity)}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="summary-totals-block">
            <div className="total-line">
              <span>List Price Subtotal</span>
              <span>{formatMoney(originalSubtotal)}</span>
            </div>

            {savings > 0 && (
              <div className="total-line savings-highlight">
                <span>DealPilot Bargaining Savings</span>
                <span className="savings-val">−{formatMoney(savings)}</span>
              </div>
            )}

            <div className="total-line">
              <span>Delivery Charges</span>
              <span className="free-tag">FREE</span>
            </div>

            <div className="total-line">
              <span>Taxes (GST Included)</span>
              <span>₹0.00</span>
            </div>

            <div className="summary-divider" />

            <div className="total-line grand-total-line">
              <strong>Final Amount to Pay</strong>
              <strong className="grand-amount">{formatMoney(total)}</strong>
            </div>
          </div>

          {savings > 0 && (
            <div className="savings-celebration-card">
              <span className="celebration-star">✦</span>
              <div className="celebration-text">
                <strong>You saved {formatMoney(savings)} on this purchase!</strong>
                <p>DealPilot successfully negotiated merchant-approved terms for your order.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
