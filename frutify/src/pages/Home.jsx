import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const features = [
  { icon: '🚚', title: 'Free Delivery', desc: 'Free shipping on all orders over $25' },
  { icon: '🌿', title: '100% Organic', desc: 'All fruits are certified organic' },
  { icon: '⚡', title: 'Same Day', desc: 'Order by noon, delivered today' },
  { icon: '💯', title: 'Freshness Guaranteed', desc: 'Fresh or we replace it free' },
];

const seasonalBanners = [
  { emoji: '🥭', label: 'Mango Season', color: '#fff4e0', accent: '#f4a623' },
  { emoji: '🍓', label: 'Berry Fresh', color: '#fff0f3', accent: '#e74c3c' },
  { emoji: '🍋', label: 'Citrus Love', color: '#fffff0', accent: '#f1c40f' },
];

export default function Home() {
  const { state, dispatch } = useStore();

  const featured = state.products.slice(0, 8);
  const topRated = [...state.products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
        </div>
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-badge">🌱 Fresh From The Farm</span>
            <h1 className="hero-title">
              Nature's Finest
              <br />
              <span className="hero-highlight">Fruits Delivered</span>
              <br />
              To Your Door
            </h1>
            <p className="hero-sub">
              Discover premium, hand-picked fruits from around the world.
              Organic, fresh, and delivered the same day.
            </p>
            <div className="hero-cta">
              <Link to="/products" className="btn-primary">Shop Now →</Link>
              <Link to="/products" className="btn-outline">Explore 50+ Fruits</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>50+</strong><span>Fruit Varieties</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>10k+</strong><span>Happy Customers</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>4.9★</strong><span>Average Rating</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-fruit-grid">
              {['🥭', '🍓', '🍇', '🫐', '🍑', '🍍', '🍉', '🍊'].map((e, i) => (
                <div key={i} className={`hero-fruit hero-fruit-${i}`}>{e}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-bar">
        <div className="container features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal */}
      <section className="seasonal-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Seasonal Picks 🌞</h2>
            <Link to="/products" className="see-all">See All →</Link>
          </div>
          <div className="seasonal-grid">
            {seasonalBanners.map(b => (
              <Link
                to="/products"
                key={b.label}
                className="seasonal-card"
                style={{ background: b.color, '--acc': b.accent }}
                onClick={() => dispatch({ type: 'SET_CATEGORY', value: b.label.split(' ')[0] })}
              >
                <span className="seasonal-emoji">{b.emoji}</span>
                <span className="seasonal-label">{b.label}</span>
                <span className="seasonal-arrow" style={{ color: b.accent }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Fruits 🍎</h2>
            <Link to="/products" className="see-all">View All →</Link>
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="top-rated-section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 24 }}>Top Rated ⭐</h2>
          <div className="top-rated-grid">
            {topRated.map(p => (
              <Link to={`/products/${p.id}`} key={p.id} className="top-rated-card">
                <span className="tr-emoji">{p.emoji}</span>
                <div className="tr-info">
                  <h4>{p.name}</h4>
                  <div className="tr-meta">
                    <span className="star">★</span>
                    <span>{p.rating}</span>
                    <span className="reviews">({p.reviews} reviews)</span>
                  </div>
                </div>
                <span className="tr-price">${p.price.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div className="cta-fruits">🍉 🍓 🥭 🍋 🫐</div>
          <h2>Ready to eat fresh?</h2>
          <p>Join thousands of happy customers enjoying farm-fresh fruits daily.</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">🍃</span>
            <strong>Frutify</strong>
            <p>Fresh fruits delivered to your door.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/checkout">Cart</Link>
            <Link to="/add-product">Add Product</Link>
          </div>
          <p className="footer-copy">© 2026 Frutify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
