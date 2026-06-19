import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Checkout.css';

const DELIVERY = 3.99;
const FREE_THRESHOLD = 25;

export default function Checkout() {
  const { state, dispatch, cartTotal } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = cart, 2 = address, 3 = payment, 4 = success
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '', country: 'US' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvv: '', cardName: '' });
  const [errors, setErrors] = useState({});

  const freeDelivery = cartTotal >= FREE_THRESHOLD;
  const delivery = cartTotal === 0 ? 0 : freeDelivery ? 0 : DELIVERY;
  const total = cartTotal + delivery;

  function handleQty(id, qty) {
    dispatch({ type: 'UPDATE_QTY', id, qty });
  }

  function handleRemove(id) {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  }

  function validateAddress() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.zip.trim()) e.zip = 'ZIP code required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePayment() {
    const e = {};
    if (payment.card.replace(/\s/g, '').length < 16) e.card = 'Enter valid 16-digit card number';
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY';
    if (payment.cvv.length < 3) e.cvv = 'Enter valid CVV';
    if (!payment.cardName.trim()) e.cardName = 'Card name required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePlaceOrder() {
    if (!validatePayment()) return;
    dispatch({ type: 'CLEAR_CART' });
    setStep(4);
  }

  function formatCard(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val) {
    const v = val.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  }

  const orderId = `FRT-${Date.now().toString().slice(-6)}`;

  if (step === 4) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="success-card">
            <div className="success-animation">🎉</div>
            <div className="success-check">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p className="success-sub">Your fresh fruits are on their way to you!</p>
            <div className="order-summary-box">
              <div className="order-row"><span>Order ID</span><strong>{orderId}</strong></div>
              <div className="order-row"><span>Delivery to</span><strong>{form.city}, {form.country}</strong></div>
              <div className="order-row"><span>Estimated delivery</span><strong>Today, 4–6 PM</strong></div>
              <div className="order-row"><span>Payment</span><strong>•••• {payment.card.slice(-4)}</strong></div>
            </div>
            <div className="success-actions">
              <Link to="/products" className="btn-primary">Continue Shopping</Link>
              <Link to="/" className="btn-outline-sm">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.cart.length === 0 && step < 4) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious fruits to get started!</p>
            <Link to="/products" className="btn-primary">Browse Fruits</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-inner">
        {/* Steps */}
        <div className="steps-bar">
          {['Cart', 'Delivery', 'Payment'].map((label, i) => (
            <div key={label} className={`step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span>{label}</span>
              {i < 2 && <div className={`step-line ${step > i + 1 ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
            {/* Step 1: Cart */}
            {step === 1 && (
              <div className="checkout-section">
                <h2 className="section-heading">🛒 Your Cart</h2>
                <div className="cart-list">
                  {state.cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="ci-emoji">{item.emoji}</div>
                      <div className="ci-info">
                        <h4>{item.name}</h4>
                        <span className="ci-weight">{item.weight}</span>
                      </div>
                      <div className="ci-qty">
                        <button onClick={() => handleQty(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => handleQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <div className="ci-price">${(item.price * item.qty).toFixed(2)}</div>
                      <button className="ci-remove" onClick={() => handleRemove(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                {!freeDelivery && (
                  <div className="delivery-progress">
                    <div className="dp-bar">
                      <div className="dp-fill" style={{ width: `${Math.min(100, (cartTotal / FREE_THRESHOLD) * 100)}%` }} />
                    </div>
                    <p>Add <strong>${(FREE_THRESHOLD - cartTotal).toFixed(2)}</strong> more for free delivery!</p>
                  </div>
                )}
                {freeDelivery && (
                  <div className="free-delivery-banner">🎉 You've unlocked free delivery!</div>
                )}
                <button className="next-btn" onClick={() => setStep(2)}>
                  Continue to Delivery →
                </button>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="checkout-section">
                <h2 className="section-heading">📍 Delivery Address</h2>
                <div className="form-grid">
                  <div className={`form-group ${errors.name ? 'error' : ''}`}>
                    <label>Full Name *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
                    {errors.name && <span className="err-msg">{errors.name}</span>}
                  </div>
                  <div className={`form-group ${errors.email ? 'error' : ''}`}>
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
                    {errors.email && <span className="err-msg">{errors.email}</span>}
                  </div>
                  <div className="form-group full">
                    <label>Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 555 000 0000" />
                  </div>
                  <div className={`form-group full ${errors.address ? 'error' : ''}`}>
                    <label>Street Address *</label>
                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="123 Fruit Lane, Apt 4B" />
                    {errors.address && <span className="err-msg">{errors.address}</span>}
                  </div>
                  <div className={`form-group ${errors.city ? 'error' : ''}`}>
                    <label>City *</label>
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="New York" />
                    {errors.city && <span className="err-msg">{errors.city}</span>}
                  </div>
                  <div className={`form-group ${errors.zip ? 'error' : ''}`}>
                    <label>ZIP Code *</label>
                    <input value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} placeholder="10001" />
                    {errors.zip && <span className="err-msg">{errors.zip}</span>}
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>
                <div className="step-nav">
                  <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                  <button className="next-btn" onClick={() => { if (validateAddress()) setStep(3); }}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="checkout-section">
                <h2 className="section-heading">💳 Payment</h2>
                <div className="payment-methods">
                  <div className="pm-active">💳 Credit / Debit Card</div>
                  <div className="pm-inactive">🍎 Apple Pay</div>
                  <div className="pm-inactive">🅿️ PayPal</div>
                </div>
                <div className="card-preview">
                  <div className="card-chip">≡≡</div>
                  <div className="card-number-display">
                    {payment.card || '•••• •••• •••• ••••'}
                  </div>
                  <div className="card-bottom">
                    <div>
                      <div className="card-label">Card Holder</div>
                      <div className="card-value">{payment.cardName || 'YOUR NAME'}</div>
                    </div>
                    <div>
                      <div className="card-label">Expires</div>
                      <div className="card-value">{payment.expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>
                <div className="form-grid">
                  <div className={`form-group full ${errors.cardName ? 'error' : ''}`}>
                    <label>Name on Card *</label>
                    <input value={payment.cardName} onChange={e => setPayment({...payment, cardName: e.target.value})} placeholder="John Doe" />
                    {errors.cardName && <span className="err-msg">{errors.cardName}</span>}
                  </div>
                  <div className={`form-group full ${errors.card ? 'error' : ''}`}>
                    <label>Card Number *</label>
                    <input value={payment.card} onChange={e => setPayment({...payment, card: formatCard(e.target.value)})} placeholder="1234 5678 9012 3456" maxLength={19} />
                    {errors.card && <span className="err-msg">{errors.card}</span>}
                  </div>
                  <div className={`form-group ${errors.expiry ? 'error' : ''}`}>
                    <label>Expiry Date *</label>
                    <input value={payment.expiry} onChange={e => setPayment({...payment, expiry: formatExpiry(e.target.value)})} placeholder="MM/YY" maxLength={5} />
                    {errors.expiry && <span className="err-msg">{errors.expiry}</span>}
                  </div>
                  <div className={`form-group ${errors.cvv ? 'error' : ''}`}>
                    <label>CVV *</label>
                    <input value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})} placeholder="123" maxLength={4} type="password" />
                    {errors.cvv && <span className="err-msg">{errors.cvv}</span>}
                  </div>
                </div>
                <div className="step-nav">
                  <button className="back-btn" onClick={() => setStep(2)}>← Back</button>
                  <button className="place-order-btn" onClick={handlePlaceOrder}>
                    🔒 Place Order · ${total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-items">
              {state.cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span className="si-emoji">{item.emoji}</span>
                  <span className="si-name">{item.name}</span>
                  <span className="si-qty">×{item.qty}</span>
                  <span className="si-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className={freeDelivery ? 'free-tag' : ''}>
                {freeDelivery ? 'FREE' : `$${DELIVERY.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-guarantee">
              <span>🌿</span>
              <span>100% freshness guarantee or your money back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
