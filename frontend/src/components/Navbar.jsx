import React from 'react';

export default function Navbar({
  cartCount = 0,
  currentView = 'home',
  onCart,
  onMerchant,
  onShop,
  onSearchFocus
}) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <button
          type="button"
          className="brand"
          onClick={onShop}
          aria-label="DealPilot Home"
        >
          <span className="brand-mark">DP</span>
          <span className="brand-text">
            <strong>Deal<span>Pilot</span></strong>
            <small>Direct Bargaining Commerce</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          <button
            type="button"
            className={currentView === 'home' ? 'active' : ''}
            onClick={onShop}
          >
            Storefront
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'home') onShop();
              setTimeout(() => {
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          >
            Browse Deals
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'home') onShop();
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          >
            How Bargaining Works
          </button>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-button search-trigger"
            onClick={onSearchFocus}
            aria-label="Focus search input"
            title="Search products"
          >
            ⌕
          </button>

          <button
            type="button"
            className={`cart-trigger ${cartCount > 0 ? 'has-items' : ''}`}
            onClick={onCart}
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <span className="bag-icon">🛍</span>
            <span className="bag-label">Bag</span>
            <b className="bag-count">{cartCount}</b>
          </button>

          <button
            type="button"
            className={`merchant-link ${currentView === 'merchant' ? 'active' : ''}`}
            onClick={onMerchant}
            aria-label="Open Merchant Workspace"
          >
            <span className="merchant-indicator">●</span>
            <span>Merchant Portal</span>
            <span className="arrow">↗</span>
          </button>
        </div>
      </div>
    </header>
  );
}
