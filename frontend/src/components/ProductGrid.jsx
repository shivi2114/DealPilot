import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  wishlist,
  onWish,
  onOpen,
  onAdd,
  onNegotiate,
  onResetFilters
}) {
  if (!products.length) {
    return (
      <div className="empty-state" role="status">
        <div className="empty-icon-circle">⌕</div>
        <h3>No matching products found</h3>
        <p>Try searching with another keyword or reset the category and filters.</p>
        {onResetFilters && (
          <button
            type="button"
            className="secondary-button"
            onClick={onResetFilters}
          >
            Clear filters & view all products
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid" role="region" aria-label="Product list">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          wished={wishlist.includes(product.id)}
          onWish={onWish}
          onOpen={onOpen}
          onAdd={onAdd}
          onNegotiate={onNegotiate}
        />
      ))}
    </div>
  );
}
