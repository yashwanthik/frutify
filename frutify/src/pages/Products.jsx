import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export default function Products() {
  const { state, dispatch, categories } = useStore();
  const [sort, setSort] = useState('default');

  let filtered = state.products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(state.search.toLowerCase()) ||
      p.category.toLowerCase().includes(state.search.toLowerCase());
    const matchCat = state.selectedCategory === 'All' || p.category === state.selectedCategory;
    return matchSearch && matchCat;
  });

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1 className="page-title">🍎 Fresh Fruit Shop</h1>
          <p className="page-sub">Discover {state.products.length}+ premium fruits, hand-picked just for you</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="category-list">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${state.selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_CATEGORY', value: cat })}
                >
                  <span className="cat-dot" />
                  {cat}
                  <span className="cat-count">
                    {cat === 'All'
                      ? state.products.length
                      : state.products.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Picks</h3>
            <div className="quick-picks">
              {state.products.filter(p => p.rating >= 4.8).slice(0, 3).map(p => (
                <div key={p.id} className="quick-pick">
                  <span>{p.emoji}</span>
                  <span className="qp-name">{p.name}</span>
                  <span className="qp-price">${p.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="products-main">
          <div className="products-toolbar">
            <div className="results-info">
              Showing <strong>{filtered.length}</strong> of {state.products.length} fruits
              {state.selectedCategory !== 'All' && <span className="active-filter"> in {state.selectedCategory}</span>}
              {state.search && <span className="active-filter"> for "{state.search}"</span>}
            </div>
            <div className="toolbar-actions">
              {(state.selectedCategory !== 'All' || state.search) && (
                <button
                  className="clear-filters"
                  onClick={() => {
                    dispatch({ type: 'SET_CATEGORY', value: 'All' });
                    dispatch({ type: 'SET_SEARCH', value: '' });
                  }}
                >
                  ✕ Clear Filters
                </button>
              )}
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No fruits found</h3>
              <p>Try adjusting your search or category filter.</p>
              <button
                className="btn-reset"
                onClick={() => {
                  dispatch({ type: 'SET_CATEGORY', value: 'All' });
                  dispatch({ type: 'SET_SEARCH', value: '' });
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid-main">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
