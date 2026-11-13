import React from 'react';

export default function CategoryTabs({ categories, selected, onSelect, counts = {} }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Product categories">
      {categories.map(cat => {
        const count = counts[cat];
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            className={`category-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(cat)}
            type="button"
          >
            <span>{cat}</span>
            {typeof count === 'number' && (
              <span className="category-count" aria-hidden="true">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
