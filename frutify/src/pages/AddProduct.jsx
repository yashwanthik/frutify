import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './ProductForm.css';

const CATEGORIES = ['Tropical', 'Berries', 'Citrus', 'Apples', 'Stone Fruits', 'Melons', 'Exotic', 'Other'];
const EMOJIS = ['🍎','🍏','🍊','🍋','🍌','🍍','🥭','🍇','🍓','🫐','🍈','🍑','🍒','🥝','🍅','🥑','🍉','🫒','🌽','🥥'];

const defaultForm = { name: '', price: '', category: 'Tropical', emoji: '🍎', stock: '', description: '', origin: '', weight: '', rating: '4.5', reviews: '0' };

export default function AddProduct() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Enter a valid stock quantity';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.origin.trim()) e.origin = 'Origin is required';
    if (!form.weight.trim()) e.weight = 'Weight is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    dispatch({
      type: 'ADD_PRODUCT',
      product: {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
      }
    });
    setSubmitted(true);
    setTimeout(() => navigate('/products'), 1500);
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  if (submitted) {
    return (
      <div className="form-page">
        <div className="container">
          <div className="form-success">
            <div className="success-icon">{form.emoji}</div>
            <h2>Product Added!</h2>
            <p>"{form.name}" has been added to your store.</p>
            <p className="redirect-note">Redirecting to shop...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="container form-container">
        <div className="form-header">
          <Link to="/products" className="back-link">← Back to Shop</Link>
          <h1 className="form-title">🌱 Add New Product</h1>
          <p className="form-sub">Add a new fruit to your Frutify store</p>
        </div>

        <div className="form-layout">
          {/* Preview */}
          <div className="preview-panel">
            <h3 className="preview-label">Live Preview</h3>
            <div className="preview-card">
              <div className="preview-image">
                <span>{form.emoji || '🍎'}</span>
              </div>
              <div className="preview-body">
                <span className="preview-category">{form.category}</span>
                <h4 className="preview-name">{form.name || 'Product Name'}</h4>
                <div className="preview-meta">
                  <span>★ {form.rating}</span>
                  <span>{form.weight || '0g'}</span>
                </div>
                <div className="preview-footer">
                  <span className="preview-price">${Number(form.price || 0).toFixed(2)}</span>
                  <span className="preview-stock">{form.stock || 0} in stock</span>
                </div>
              </div>
            </div>

            <div className="emoji-picker">
              <h3 className="picker-label">Choose Emoji</h3>
              <div className="emoji-grid">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    type="button"
                    className={`emoji-btn ${form.emoji === e ? 'selected' : ''}`}
                    onClick={() => set('emoji', e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h3 className="fs-title">Basic Info</h3>
              <div className="form-row">
                <div className={`fg ${errors.name ? 'error' : ''}`}>
                  <label>Product Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Fuji Apple" />
                  {errors.name && <span className="err">{errors.name}</span>}
                </div>
                <div className="fg">
                  <label>Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row three-col">
                <div className={`fg ${errors.price ? 'error' : ''}`}>
                  <label>Price ($) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
                  {errors.price && <span className="err">{errors.price}</span>}
                </div>
                <div className={`fg ${errors.stock ? 'error' : ''}`}>
                  <label>Stock *</label>
                  <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
                  {errors.stock && <span className="err">{errors.stock}</span>}
                </div>
                <div className={`fg ${errors.weight ? 'error' : ''}`}>
                  <label>Weight *</label>
                  <input value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 500g" />
                  {errors.weight && <span className="err">{errors.weight}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="fs-title">Details</h3>
              <div className={`fg full ${errors.description ? 'error' : ''}`}>
                <label>Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Describe this fruit — flavor, texture, best uses..."
                  rows={4}
                />
                {errors.description && <span className="err">{errors.description}</span>}
              </div>
              <div className="form-row">
                <div className={`fg ${errors.origin ? 'error' : ''}`}>
                  <label>Origin *</label>
                  <input value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="e.g. Spain" />
                  {errors.origin && <span className="err">{errors.origin}</span>}
                </div>
                <div className="fg">
                  <label>Initial Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set('rating', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link to="/products" className="cancel-btn">Cancel</Link>
              <button type="submit" className="submit-btn">🌱 Add Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
