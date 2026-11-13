import React, { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';

const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function Home({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  products = [],
  cart = [],
  wishlist,
  onWish,
  onOpen,
  onAdd,
  onNegotiate,
  onNotify
}) {
  const [sortBy, setSortBy] = useState('featured');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    categories.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = products.filter(p => p.category === cat).length;
      }
    });
    return counts;
  }, [categories, products]);

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesCategory = category === 'All' || product.category === category;
      const term = search.toLowerCase().trim();
      const matchesSearch = !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term)) ||
        (Array.isArray(product.features) && product.features.some(f => f.toLowerCase().includes(term)));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || a.originalPrice) - (b.price || b.originalPrice));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || b.originalPrice) - (a.price || a.originalPrice));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (parseInt(b.sold, 10) || 0) - (parseInt(a.sold, 10) || 0));
    }

    return result;
  }, [products, category, search, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setSortBy('featured');
  };

  // Find if user has an item in their cart that hasn't been negotiated yet
  const unnegotiatedCartItem = cart.find(item => !item.offer?.offerPrice);
  const activeCartItem = unnegotiatedCartItem || (cart.length > 0 ? cart[0] : null);

  // Dynamic sample for the hero preview: reflects active cart item if available
  const sampleFeatured = activeCartItem ? activeCartItem.product : (products[0] || {});

  const handleStartBargaining = () => {
    if (activeCartItem) {
      onNegotiate(activeCartItem.product);
      return;
    }
    // If no items in cart, guide user to catalog so they pick their specific product
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    if (onNotify) {
      onNotify('Select any product below (e.g. Smart Watch, USB-C Hub) to bargain its price', 'info');
    }
  };

  return (
    <main className="home-main">
      {/* Hero Section */}
      <section className="hero-section" aria-label="Introduction">
        <div className="hero-content">
          <div className="hero-eyebrow-chip">
            <span className="sparkle">✦</span>
            <span>DEALPILOT ONLINE BARGAINING</span>
          </div>

          <h1 className="hero-title">
            Stop paying list price.<br />
            <em>Bargain directly.</em>
          </h1>

          <p className="hero-subtitle">
            DealPilot connects you directly with merchant pricing guardrails. Propose your target price or let our AI agent find the best merchant-approved deal in seconds.
          </p>

          <div className="hero-badges">
            <div className="hero-badge-item">
              <span className="badge-check">✓</span>
              <span>Merchant-Guaranteed Deals</span>
            </div>
            <div className="hero-badge-item">
              <span className="badge-check">✓</span>
              <span>Deterministic Policy Guardrails</span>
            </div>
            <div className="hero-badge-item">
              <span className="badge-check">✓</span>
              <span>Razorpay Encrypted Payments</span>
            </div>
          </div>

          <div className="hero-cta-group">
            <button
              type="button"
              className="primary-button hero-cta"
              onClick={handleStartBargaining}
            >
              <span>
                {activeCartItem
                  ? `Bargain ${activeCartItem.product.name} in Bag`
                  : 'Negotiate a Deal Now'}
              </span>
              <span className="arrow">↗</span>
            </button>
            <a href="#how-it-works" className="secondary-button how-it-works-link">
              See How It Works
            </a>
          </div>
        </div>

        {/* Live Deal Showcase Widget */}
        <div className="hero-interactive-card">
          <div className="hero-card-header">
            <span className="live-pill">
              <i className="pulse-dot" /> LIVE BARGAIN PREVIEW
            </span>
            <span className="timer-tag">Instant AI Response</span>
          </div>

          <div className="hero-card-product">
            <img
              src={sampleFeatured.image}
              alt={sampleFeatured.name || "Sample product"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=85';
              }}
            />
            <div className="hero-product-meta">
              <span className="product-category-tag">{sampleFeatured.category || "Audio"}</span>
              <strong className="product-heading">{sampleFeatured.name || "Product"}</strong>
              <div className="hero-price-comparison">
                <span className="deal-price">
                  {formatMoney(Math.round((sampleFeatured.price || 4999) * 0.86))}
                </span>
                <del className="original-price">{formatMoney(sampleFeatured.price || 4999)}</del>
                <span className="savings-pill">Save 14%</span>
              </div>
            </div>
          </div>

          <div className="hero-negotiation-snippet">
            <div className="snippet-bid">
              <span className="snippet-who">Buyer:</span>
              <p>“Can I get 14% off with free shipping on this {sampleFeatured.name}?”</p>
            </div>
            <div className="snippet-response">
              <span className="snippet-who">DealPilot:</span>
              <p>“Offer approved by seller policy! Special price unlocked.”</p>
            </div>
          </div>

          <div className="hero-card-footer">
            <span className="free-ship-tag">✓ Free Express Delivery</span>
            <span className="returns-tag">✓ 7-Day Returns</span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-section" aria-label="How DealPilot Works">
        <div className="section-header-centered">
          <span className="section-eyebrow">TRANSPARENT COMMERCE</span>
          <h2 className="section-title">How DealPilot Bargaining Works</h2>
          <p className="section-desc">Fair prices without adversarial haggling or waiting hours for email replies.</p>
        </div>

        <div className="how-steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Discover & Pick</h3>
            <p>Select any product from verified merchants with active bargaining policies enabled.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Propose Your Bid</h3>
            <p>Enter your target price or click quick presets. DealPilot’s AI evaluates against merchant floor rules.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Lock Deal & Checkout</h3>
            <p>Once approved, your negotiated discount is locked in your bag with full buyer protection.</p>
          </div>
        </div>
      </section>

      {/* Product Discovery Section */}
      <section className="shop-section" id="shop" aria-label="Browse Negotiable Products">
        <div className="shop-section-head">
          <div>
            <span className="section-eyebrow">CURATED CATALOG</span>
            <h2 className="section-title">Explore Negotiable Products</h2>
            <p className="section-desc">Every product listed below is eligible for price negotiation with DealPilot.</p>
          </div>
          <div className="results-badge">
            <strong>{displayedProducts.length}</strong> {displayedProducts.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        <div className="discovery-controls-bar">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
          />

          <div className="sort-dropdown-container">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort product catalog"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <CategoryTabs
          categories={categories}
          selected={category}
          onSelect={setCategory}
          counts={categoryCounts}
        />

        <ProductGrid
          products={displayedProducts}
          wishlist={wishlist}
          onWish={onWish}
          onOpen={onOpen}
          onAdd={onAdd}
          onNegotiate={onNegotiate}
          onResetFilters={resetFilters}
        />
      </section>

      {/* Conversion Banner */}
      <section className="dealpilot-cta-banner">
        <div className="banner-text">
          <span className="section-eyebrow light">AI-DRIVEN COMMERCE</span>
          <h2>Ready to unlock your personal deal?</h2>
          <p>
            {activeCartItem
              ? `You have ${activeCartItem.product.name} in your bag. Bargain its price directly with the merchant!`
              : 'Select any item from our catalog and test our AI bargaining agent. No commitments until you accept the offer.'}
          </p>
        </div>
        <button
          type="button"
          className="primary-button highlight-invert"
          onClick={handleStartBargaining}
        >
          <span>
            {activeCartItem
              ? `Start Bargaining on ${activeCartItem.product.name}`
              : 'Start Bargaining Now'}
          </span>
          <span className="arrow">↗</span>
        </button>
      </section>
    </main>
  );
}
