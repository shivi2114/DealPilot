import React from 'react';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function DealCard({ product, offer, onAccept, onCounterAgain }) {
  if (!offer) return null;

  const originalPrice = product.price || product.originalPrice;
  const dealPrice = offer.offerPrice;
  const savingsAmount = Math.max(0, originalPrice - dealPrice);
  const savingsPercent = originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;

  return (
    <section className="deal-card-panel" aria-label="Negotiated Deal Offer">
      <div className="deal-card-header">
        <div className="deal-title-box">
          <span className="deal-eyebrow">OFFICIAL NEGOTIATED OFFER</span>
          <h3 className="deal-title">DealPilot Custom Bargain</h3>
        </div>
        <div className={`deal-status-badge ${offer.policyPassed ? 'approved' : 'counter'}`}>
          {offer.policyPassed ? '✓ Policy Approved' : '✦ Merchant Counter-Offer'}
        </div>
      </div>

      <div className="deal-comparison-grid">
        <div className="comparison-col original">
          <span className="col-label">Standard List Price</span>
          <del className="col-price strikethrough">{formatMoney(originalPrice)}</del>
        </div>

        <div className="comparison-col deal">
          <span className="col-label">Your Negotiated Price</span>
          <strong className="col-price highlight">{formatMoney(dealPrice)}</strong>
        </div>

        <div className="comparison-col savings">
          <span className="col-label">Total Buyer Savings</span>
          <div className="savings-badge">
            <span className="saving-rupees">Save {formatMoney(savingsAmount)}</span>
            {savingsPercent > 0 && <span className="saving-percent">({savingsPercent}% OFF)</span>}
          </div>
        </div>
      </div>

      <div className="deal-perks-row">
        <span className="perks-label">Included Terms & Benefits:</span>
        <div className="perks-list">
          <span className={`perk-badge ${offer.freeShipping ? 'active' : ''}`}>
            ✓ {offer.freeShipping ? 'Free Express Delivery Included' : 'Standard Shipping'}
          </span>
          {offer.freeGift && (
            <span className="perk-badge active gift">
              🎁 Free Perk: {offer.freeGift}
            </span>
          )}
          <span className="perk-badge verified">
            🛡 Authenticity & 7-Day Returns Protected
          </span>
        </div>
      </div>

      {offer.reason && (
        <div className="deal-rationale-box">
          <span className="rationale-label">Merchant Policy Note:</span>
          <p className="rationale-text">{offer.reason}</p>
        </div>
      )}

      <div className="deal-action-buttons">
        <button
          type="button"
          className="primary-button deal-accept-btn"
          onClick={onAccept}
        >
          <span>Accept Deal & Secure Checkout</span>
          <span className="arrow">→</span>
        </button>

        {onCounterAgain && (
          <button
            type="button"
            className="secondary-button deal-counter-btn"
            onClick={onCounterAgain}
          >
            Counter / Adjust Offer
          </button>
        )}
      </div>

      <div className="deal-guarantee-footer">
        <small>
          🔒 <strong>Binding Offer:</strong> Once accepted, this negotiated price is locked for your checkout session. No coupon codes needed.
        </small>
      </div>
    </section>
  );
}
