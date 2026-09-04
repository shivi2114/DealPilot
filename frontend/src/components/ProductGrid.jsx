import React from 'react';
import ProductCard from './ProductCard';
export default function ProductGrid({ products, wishlist, onWish, onOpen, onAdd, onNegotiate }) { if (!products.length) return <div className="empty-state"><span>⌕</span><h3>No products match that search</h3><p>Try a different keyword or clear the filters to see everything.</p></div>; return <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} wished={wishlist.includes(product.id)} onWish={onWish} onOpen={onOpen} onAdd={onAdd} onNegotiate={onNegotiate} />)}</div>; }
