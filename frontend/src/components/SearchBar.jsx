import React from 'react';
export default function SearchBar({ value, onChange, onClear }) { return <div className="search-bar"><span>⌕</span><input aria-label="Search products" value={value} onChange={e => onChange(e.target.value)} placeholder="Search products, categories, brands..." />{value && <button onClick={onClear} aria-label="Clear search">×</button>}<kbd>⌘ K</kbd></div>; }
