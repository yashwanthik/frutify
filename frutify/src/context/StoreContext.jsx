import { createContext, useContext, useReducer } from 'react';

const initialProducts = [
  { id: 1, name: 'Alphonso Mango', price: 4.99, category: 'Tropical', emoji: '🥭', stock: 50, description: 'Premium Alphonso mangoes, rich in flavor with a creamy texture. Sourced from the finest orchards.', origin: 'India', weight: '500g', rating: 4.8, reviews: 124 },
  { id: 2, name: 'Red Strawberries', price: 3.49, category: 'Berries', emoji: '🍓', stock: 80, description: 'Fresh, plump strawberries bursting with sweetness. Perfect for desserts or eating fresh.', origin: 'Spain', weight: '400g', rating: 4.7, reviews: 98 },
  { id: 3, name: 'Watermelon', price: 6.99, category: 'Melons', emoji: '🍉', stock: 30, description: 'Large, juicy watermelons seedless variety. Perfectly sweet and refreshing for summer.', origin: 'USA', weight: '3kg', rating: 4.6, reviews: 87 },
  { id: 4, name: 'Banana Bunch', price: 2.29, category: 'Tropical', emoji: '🍌', stock: 120, description: 'Ripe, golden bananas packed with potassium and energy. Great for breakfast or smoothies.', origin: 'Ecuador', weight: '700g', rating: 4.5, reviews: 213 },
  { id: 5, name: 'Blueberries', price: 5.49, category: 'Berries', emoji: '🫐', stock: 60, description: 'Antioxidant-rich blueberries with a perfect balance of sweet and tart.', origin: 'Chile', weight: '300g', rating: 4.9, reviews: 156 },
  { id: 6, name: 'Pineapple', price: 3.99, category: 'Tropical', emoji: '🍍', stock: 40, description: 'Sweet and tangy tropical pineapple, hand-selected for peak ripeness.', origin: 'Costa Rica', weight: '1.2kg', rating: 4.7, reviews: 72 },
  { id: 7, name: 'Green Apple', price: 3.29, category: 'Apples', emoji: '🍏', stock: 90, description: 'Crisp and tart Granny Smith apples. Perfect for snacking, baking, or salads.', origin: 'New Zealand', weight: '600g', rating: 4.6, reviews: 103 },
  { id: 8, name: 'Orange', price: 2.99, category: 'Citrus', emoji: '🍊', stock: 100, description: 'Juicy navel oranges packed with vitamin C. Perfect for juicing or snacking.', origin: 'Morocco', weight: '600g', rating: 4.5, reviews: 189 },
  { id: 9, name: 'Grapes', price: 4.29, category: 'Berries', emoji: '🍇', stock: 70, description: 'Seedless red globe grapes with a rich, sweet flavor. Ideal for snacking or wine pairings.', origin: 'Italy', weight: '500g', rating: 4.8, reviews: 91 },
  { id: 10, name: 'Peach', price: 3.79, category: 'Stone Fruits', emoji: '🍑', stock: 45, description: 'Velvety, aromatic peaches with a juicy flesh. Best enjoyed ripe at room temperature.', origin: 'France', weight: '500g', rating: 4.6, reviews: 67 },
  { id: 11, name: 'Lemon', price: 1.99, category: 'Citrus', emoji: '🍋', stock: 150, description: 'Zesty, bright lemons perfect for cooking, baking, and refreshing drinks.', origin: 'Spain', weight: '400g', rating: 4.4, reviews: 144 },
  { id: 12, name: 'Cherry', price: 6.49, category: 'Stone Fruits', emoji: '🍒', stock: 35, description: 'Sweet, dark cherries with a rich flavor. Perfect for desserts or eating fresh.', origin: 'Turkey', weight: '400g', rating: 4.9, reviews: 78 },
];

const StoreContext = createContext(null);

function storeReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.id === action.product.id);
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, cart: [...state.cart, { ...action.product, qty: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) return { ...state, cart: state.cart.filter(i => i.id !== action.id) };
      return { ...state, cart: state.cart.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, { ...action.product, id: Date.now() }] };
    case 'EDIT_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.product.id ? action.product : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id), cart: state.cart.filter(i => i.id !== action.id) };
    case 'SET_SEARCH':
      return { ...state, search: action.value };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.value };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, {
    products: initialProducts,
    cart: [],
    search: '',
    selectedCategory: 'All',
  });

  const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const categories = ['All', ...new Set(initialProducts.map(p => p.category))];

  return (
    <StoreContext.Provider value={{ state, dispatch, cartCount, cartTotal, categories }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
