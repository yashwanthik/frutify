import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { dispatch, state } = useStore();
  const inCart = state.cart.find(i => i.id === product.id);

  function handleAdd(e) {
    e.preventDefault();
    dispatch({ type: 'ADD_TO_CART', product });
  }

  function handleDelete(e) {
    e.preventDefault();
    if (confirm(`Delete "${product.name}"?`)) {
      dispatch({ type: 'DELETE_PRODUCT', id: product.id });
    }
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="card-link">
        <div className="card-image">
          <span className="fruit-emoji">{product.emoji}</span>
          {product.stock < 10 && <span className="low-stock-badge">Low Stock</span>}
        </div>
        <div className="card-body">
          <span className="card-category">{product.category}</span>
          <h3 className="card-name">{product.name}</h3>
          <div className="card-meta">
            <div className="card-rating">
              <span className="star">★</span>
              <span>{product.rating}</span>
              <span className="reviews">({product.reviews})</span>
            </div>
            <span className="card-weight">{product.weight}</span>
          </div>
          <div className="card-footer">
            <span className="card-price">${product.price.toFixed(2)}</span>
            <div className="card-actions">
              <Link to={`/edit-product/${product.id}`} className="edit-btn" onClick={e => e.stopPropagation()}>✏️</Link>
              <button className="delete-btn" onClick={handleDelete}>🗑️</button>
              <button
                className={`add-btn ${inCart ? 'in-cart' : ''}`}
                onClick={handleAdd}
              >
                {inCart ? `✓ ${inCart.qty}` : '+ Add'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
