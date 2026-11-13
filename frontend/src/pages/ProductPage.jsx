import React from 'react';
import DealCard from '../components/DealCard';
import AIChat from '../components/AIChat';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function ProductPage({
  product,
  offer,
  messages,
  loading,
  error,
  wished,
  onWish,
  onBack,
  onSend,
  onAccept,
  onAdd,
  onCloseChat,
  onOpenChat
}) {
  if (!product) return null;

  const seller = product.seller || {
    name: 'Northstar Goods',
    rating: 4.9,
    reviewsCount: 1420,
    verified: true,
    returnPolicy: '7-day hassle-free returns',
    shipsFrom: 'Bengaluru, India',
    responseTime: '< 2 mins'
  };

  const listPrice = product.price || product.originalPrice;

  return (
    <main className="product-detail-page">
      <div className="detail-top-nav">
        <button
          type="button"
          className="back-btn-pill"
          onClick={onBack}
          aria-label="Return to product catalog"
        >
          ← Back to Catalog
        </button>
        <span className="breadcrumb-path">
          Storefront / {product.category} / <strong>{product.name}</strong>
        </span>
      </div>

      <div className="product-detail-layout">
        {/* Left Column: Media & Verified Merchant Card */}
        <section className="detail-media-column">
          <div className="detail-image-wrapper">
            {product.badge && <span className="product-badge top-left">{product.badge}</span>}
            <button
              type="button"
              className={`wish-button detail-wish ${wished ? 'wished' : ''}`}
              onClick={() => onWish(product.id)}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wished ? '♥' : '♡'}
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="main-product-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=85';
              }}
            />
          </div>

          <div className="media-trust-strip">
            <span className="trust-check">✓ Authenticity Inspected</span>
            <span className="trust-check">✓ Verified High-Res Photography</span>
          </div>

          {/* Seller Trust Profile Card */}
          <div className="seller-profile-card">
            <div className="seller-head">
              <div className="seller-avatar">
                {seller.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="seller-info">
                <div className="seller-name-row">
                  <strong>{seller.name}</strong>
                  {seller.verified && (
                    <span className="verified-badge-pill" title="Verified DealPilot Merchant">
                      ✓ Verified Seller
                    </span>
                  )}
                </div>
                <div className="seller-rating-line">
                  <span className="stars">★</span>
                  <span>{seller.rating} / 5.0</span>
                  <span className="dot">·</span>
                  <span className="reviews">{seller.reviewsCount || 1200} buyer reviews</span>
                </div>
              </div>
            </div>

            <div className="seller-specs-grid">
              <div className="seller-spec-item">
                <span className="spec-label">Ships From</span>
                <strong className="spec-val">{seller.shipsFrom || 'India'}</strong>
              </div>
              <div className="seller-spec-item">
                <span className="spec-label">Returns</span>
                <strong className="spec-val">{seller.returnPolicy || '7-day policy'}</strong>
              </div>
              <div className="seller-spec-item full-width">
                <span className="spec-label">Automated Negotiation</span>
                <strong className="spec-val highlight-green">
                  Active policy enabled via DealPilot
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Pricing, Negotiation CTA & Details */}
        <section className="detail-info-column">
          <div className="category-pill-row">
            <span className="detail-category-tag">{product.category}</span>
            <span className="in-stock-tag">● In Stock & Ready to Dispatch</span>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>

          <div className="detail-social-proof">
            <div className="stars-box">
              <span className="stars">★</span>
              <strong>{product.rating}</strong>
            </div>
            <span className="dot">·</span>
            <span className="sold-volume">{product.sold} verified orders</span>
            <span className="dot">·</span>
            <span className="satisfaction-rate">98% positive reviews</span>
          </div>

          {/* Pricing Banner */}
          <div className="detail-pricing-box">
            <div className="price-primary">
              <span className="price-title">Official List Price</span>
              <strong className="price-amount">{formatMoney(listPrice)}</strong>
              <small className="tax-inclusive">Inclusive of all taxes</small>
            </div>

            <div className="bargain-invitation">
              <div className="bargain-invitation-head">
                <span className="sparkle">✦</span>
                <strong>Negotiate a Better Deal</strong>
              </div>
              <p>
                The seller has authorized DealPilot to negotiate discounts, bundle perks, or offer free delivery on this item.
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="primary-actions-stack">
            <button
              type="button"
              className="primary-button bargain-trigger-btn"
              onClick={() => {
                if (onOpenChat) onOpenChat();
                else onSend('__open__');
              }}
            >
              <span className="sparkle">✦</span>
              <span>Bargain with DealPilot AI</span>
              <span className="arrow">↗</span>
            </button>

            <div className="standard-buy-row">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onAdd(product)}
              >
                Add to bag at list price
              </button>
              <button
                type="button"
                className="secondary-button buy-now-btn"
                onClick={() => onAccept(null)}
              >
                Buy now (List price)
              </button>
            </div>
          </div>

          {/* Active Deal Offer Display (if negotiated) */}
          {offer && (
            <div className="active-offer-section">
              <DealCard
                product={product}
                offer={offer}
                onAccept={() => onAccept(offer)}
                onCounterAgain={() => {
                  if (onOpenChat) onOpenChat();
                  else onSend('__open__');
                }}
              />
            </div>
          )}

          {/* Product Description */}
          <div className="detail-section-block">
            <h3 className="block-title">About this product</h3>
            <p className="detail-description">{product.description}</p>
          </div>

          {/* Key Features */}
          {Array.isArray(product.features) && product.features.length > 0 && (
            <div className="detail-section-block">
              <h3 className="block-title">Key Highlights</h3>
              <ul className="detail-features-grid">
                {product.features.map(feature => (
                  <li key={feature} className="feature-item">
                    <span className="check-mark">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Specs */}
          {product.specs && (
            <div className="detail-section-block">
              <h3 className="block-title">Specifications</h3>
              <div className="specs-pill-box">
                {product.specs.split('|').map(spec => (
                  <span key={spec.trim()} className="spec-pill">
                    {spec.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trust Assurances */}
          <div className="trust-assurances-grid">
            <div className="assurance-card">
              <span className="assurance-icon">📦</span>
              <div>
                <strong>Free Standard Delivery</strong>
                <small>Dispatches within 24 hours</small>
              </div>
            </div>
            <div className="assurance-card">
              <span className="assurance-icon">🔄</span>
              <div>
                <strong>7-Day Returns</strong>
                <small>Hassle-free merchant policy</small>
              </div>
            </div>
            <div className="assurance-card">
              <span className="assurance-icon">🔒</span>
              <div>
                <strong>Razorpay Protected</strong>
                <small>256-bit SSL encrypted</small>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Negotiation AI Panel Overlay */}
      {messages && (
        <AIChat
          product={product}
          messages={messages}
          loading={loading}
          error={error}
          offer={offer}
          onSend={onSend}
          onClose={onCloseChat}
          onAcceptOffer={onAccept}
        />
      )}
    </main>
  );
}
