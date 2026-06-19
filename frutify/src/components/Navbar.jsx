import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, state, dispatch } = useStore();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🍃</span>
          <span className="logo-text">Frutify</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'nav-link active' : 'nav-link'}>Shop</Link>
          <Link to="/add-product" className={location.pathname === '/add-product' ? 'nav-link active' : 'nav-link'}>Add Product</Link>
        </div>

        <div className="nav-actions">
          <div className="nav-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search fruits..."
              value={state.search}
              onChange={e => dispatch({ type: 'SET_SEARCH', value: e.target.value })}
            />
          </div>
          <Link to="/checkout" className="cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
