import React from 'react';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function ProductCard({ product, wished, onWish, onOpen, onAdd, onNegotiate }) {
  const sellerName = product.seller?.name || 'Verified Merchant';

  return (
    <article className="product-card" aria-label={product.name}>
      <div className="product-card-top">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          type="button"
          className={`wish-button ${wished ? 'wished' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onWish(product.id);
          }}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      <button
        type="button"
        className="product-visual"
        onClick={() => onOpen(product)}
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=85';
          }}
        />
        <div className="visual-overlay">
          <span>View product & terms ↗</span>
        </div>
      </button>

      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-category">{product.category}</span>
          <span className="seller-tag" title={`Sold by ${sellerName}`}>
            ✓ {sellerName.split(' ')[0]}
          </span>
        </div>

        <button
          type="button"
          className="product-title"
          onClick={() => onOpen(product)}
        >
          {product.name}
        </button>

        <div className="rating-row">
          <span className="stars">★</span>
          <strong>{product.rating}</strong>
          <span className="rating-dot">·</span>
          <span className="sold-count">{product.sold} sold</span>
        </div>

        <div className="price-row">
          <div className="price-block">
            <span className="price-label">List price</span>
            <strong className="current-price">{formatMoney(product.price || product.originalPrice)}</strong>
          </div>
          <div className="negotiate-chip" title="Direct price bargaining enabled by merchant">
            <span className="sparkle">✦</span>
            <span>Open to offers</span>
          </div>
        </div>

        <div className="card-perks">
          {product.freeShippingAvailable && <span className="perk">Free delivery</span>}
          {product.giftAvailable && <span className="perk">Gift eligible</span>}
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to bag at regular price`}
          >
            Add to bag
          </button>
          <button
            type="button"
            className="primary-button highlight"
            onClick={() => onNegotiate(product)}
            aria-label={`Negotiate price for ${product.name}`}
          >
            <span>✦ Negotiate</span>
          </button>
        </div>
      </div>
    </article>
  );
}
