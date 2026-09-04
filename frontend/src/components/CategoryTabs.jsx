import React from 'react';
export default function CategoryTabs({ categories, selected, onSelect }) { return <div className="category-tabs" id="categories">{categories.map(category => <button key={category} className={selected === category ? 'active' : ''} onClick={() => onSelect(category)}>{category}</button>)}</div>; }
