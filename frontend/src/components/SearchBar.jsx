import React from 'react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-bar" role="search">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search products by name, category, or features (e.g. noise cancellation, mechanical)..."
        aria-label="Search negotiable products"
      />
      {value ? (
        <button
          type="button"
          className="search-clear-btn"
          onClick={onClear}
          aria-label="Clear search query"
        >
          ✕
        </button>
      ) : (
        <kbd className="search-shortcut" title="Press / to search">/</kbd>
      )}
    </div>
  );
}
