import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const product = state.products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="not-found">
        <div className="nf-inner">
          <div className="nf-icon">🍃</div>
          <h2>Product not found</h2>
          <p>This fruit may have been removed or doesn't exist.</p>
          <Link to="/products" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const inCart = state.cart.find(i => i.id === product.id);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      dispatch({ type: 'ADD_TO_CART', product });
    }
  }

  function handleDelete() {
    if (confirm(`Delete "${product.name}"?`)) {
      dispatch({ type: 'DELETE_PRODUCT', id: product.id });
      navigate('/products');
    }
  }

  const related = state.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/products">Shop</Link>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image-wrap">
            <div className="detail-image">
              <span className="detail-emoji">{product.emoji}</span>
            </div>
            <div className="detail-badges">
              <span className="badge-organic">🌿 Organic</span>
              <span className="badge-fresh">✓ Fresh Guaranteed</span>
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= Math.round(product.rating) ? 'star filled' : 'star'}>★</span>
              ))}
              <span className="rating-num">{product.rating}</span>
              <span className="rating-count">({product.reviews} reviews)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">${product.price.toFixed(2)}</span>
              <span className="detail-per">per {product.weight}</span>
            </div>

            <p className="detail-desc">{product.description}</p>

            <div className="detail-specs">
              <div className="spec"><span className="spec-label">Origin</span><span className="spec-val">🌍 {product.origin}</span></div>
              <div className="spec"><span className="spec-label">Weight</span><span className="spec-val">⚖️ {product.weight}</span></div>
              <div className="spec"><span className="spec-label">Stock</span><span className={`spec-val ${product.stock < 10 ? 'low' : 'ok'}`}>{product.stock < 10 ? `⚠️ Only ${product.stock} left` : `✓ ${product.stock} available`}</span></div>
            </div>

            <div className="detail-actions">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="add-cart-btn" onClick={handleAddToCart}>
                🛒 {inCart ? `Add More (${inCart.qty} in cart)` : 'Add to Cart'}
              </button>
            </div>

            <div className="detail-admin-actions">
              <Link to={`/edit-product/${product.id}`} className="edit-link">✏️ Edit Product</Link>
              <button className="delete-link" onClick={handleDelete}>🗑️ Delete Product</button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="related-section">
            <h2 className="section-title">More from {product.category}</h2>
            <div className="related-grid">
              {related.map(p => (
                <Link to={`/products/${p.id}`} key={p.id} className="related-card">
                  <span className="related-emoji">{p.emoji}</span>
                  <h4>{p.name}</h4>
                  <span>${p.price.toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
