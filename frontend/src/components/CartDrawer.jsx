import React from 'react';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function CartDrawer({
  cart = [],
  open = false,
  onClose,
  onQty,
  onRemove,
  onCheckout,
  onNegotiateItem
}) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const originalTotal = cart.reduce((sum, item) => {
    const listPrice = item.product.price || item.product.originalPrice;
    return sum + listPrice * item.quantity;
  }, 0);

  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.offer?.offerPrice || item.product.price || item.product.originalPrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  const totalSavings = Math.max(0, originalTotal - subtotal);
  const negotiatedItemsCount = cart.filter(item => Boolean(item.offer?.offerPrice)).length;
  const unnegotiatedItems = cart.filter(item => !item.offer?.offerPrice);

  return (
    <div
      className={`drawer-overlay ${open ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag drawer"
    >
      <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">YOUR SHOPPING BAG</span>
            <h2 className="drawer-title">
              {cart.length ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Your bag is empty'}
            </h2>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close bag"
          >
            ✕
          </button>
        </div>

        {cart.length > 0 ? (
          <>
            <div className="cart-items-scroll">
              {cart.map(item => {
                const listPrice = item.product.price || item.product.originalPrice;
                const activePrice = item.offer?.offerPrice || listPrice;
                const hasOffer = Boolean(item.offer?.offerPrice && item.offer.offerPrice < listPrice);
                const itemSavings = (listPrice - activePrice) * item.quantity;

                return (
                  <div className="cart-item-card" key={item.product.id}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="cart-item-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=85';
                      }}
                    />
                    <div className="cart-item-body">
                      <div className="cart-item-head">
                        <strong className="cart-item-title">{item.product.name}</strong>
                        <button
                          type="button"
                          className="cart-remove-link"
                          onClick={() => onRemove(item.product.id)}
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="cart-item-pricing">
                        <strong className="effective-price">
                          {formatMoney(activePrice * item.quantity)}
                        </strong>
                        {hasOffer ? (
                          <div className="bargain-applied-tag">
                            <del>{formatMoney(listPrice * item.quantity)}</del>
                            <span className="saved-badge">Saved {formatMoney(itemSavings)}</span>
                          </div>
                        ) : (
                          onNegotiateItem && (
                            <button
                              type="button"
                              className="cart-bargain-item-pill"
                              onClick={() => onNegotiateItem(item.product)}
                              title={`Start price bargaining for ${item.product.name}`}
                            >
                              <span>✦ Bargain price</span>
                            </button>
                          )
                        )}
                      </div>

                      {hasOffer && item.offer.freeGift && (
                        <div className="cart-gift-badge">
                          🎁 Bonus perk: {item.offer.freeGift}
                        </div>
                      )}

                      <div className="cart-item-footer">
                        <div className="qty-picker">
                          <button
                            type="button"
                            onClick={() => onQty(item.product.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onQty(item.product.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="unit-indicator">
                          {formatMoney(activePrice)} / unit
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-drawer-summary">
              {negotiatedItemsCount > 0 ? (
                <div className="dealpilot-savings-banner">
                  <span className="spark-badge">✦</span>
                  <div className="banner-copy">
                    <strong>DealPilot Bargain Applied</strong>
                    <small>
                      {negotiatedItemsCount} {negotiatedItemsCount === 1 ? 'deal was' : 'deals were'} negotiated and verified by merchant policy.
                    </small>
                  </div>
                </div>
              ) : null}

              {unnegotiatedItems.length > 0 && onNegotiateItem && (
                <div className="cart-unbargained-banner">
                  <div className="unbargained-text">
                    <strong>Want a discount on your {unnegotiatedItems[0].product.name}?</strong>
                    <small>Bargain directly with seller AI guardrails.</small>
                  </div>
                  <button
                    type="button"
                    className="unbargained-action-btn"
                    onClick={() => onNegotiateItem(unnegotiatedItems[0].product)}
                  >
                    <span>✦ Bargain Now</span>
                    <span>→</span>
                  </button>
                </div>
              )}

              <div className="price-breakdown-lines">
                <div className="line-row">
                  <span>List Price Total</span>
                  <span className="line-val">{formatMoney(originalTotal)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="line-row savings-row">
                    <span>Negotiated Savings</span>
                    <span className="line-val discount">−{formatMoney(totalSavings)}</span>
                  </div>
                )}
                <div className="line-row">
                  <span>Delivery</span>
                  <span className="line-val free-delivery">FREE</span>
                </div>
                <div className="line-divider" />
                <div className="line-row total-row">
                  <strong>Estimated Total</strong>
                  <strong className="grand-total">{formatMoney(subtotal)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="primary-button checkout-cta-btn"
                onClick={onCheckout}
              >
                <span>Proceed to Checkout</span>
                <span className="arrow">→</span>
              </button>

              <div className="cart-security-pill">
                🔒 Guaranteed merchant checkout · Zero hidden fees
              </div>
            </div>
          </>
        ) : (
          <div className="cart-empty-view">
            <div className="empty-cart-icon">🛍</div>
            <h3>Your shopping bag is empty</h3>
            <p>Discover products, make an offer with DealPilot, and unlock verified merchant deals.</p>
            <button
              type="button"
              className="primary-button"
              onClick={onClose}
            >
              Browse negotiable products
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
