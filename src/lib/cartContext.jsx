import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'raijin_cart_v1';

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, variant, quantity } = action;
      const key = `${product.id}|${variant || ''}`;
      const price = (product.sale_price != null && product.sale_price > 0) ? product.sale_price : product.price;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return { ...state, items: state.items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i)) };
      }
      return { ...state, items: [...state.items, { key, productId: product.id, name: product.name, slug: product.slug, variant: variant || '', quantity, price, image: (product.images || [])[0] || '' }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.key !== action.key) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map((i) => (i.key === action.key ? { ...i, quantity: Math.max(1, action.quantity) } : i)) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'HYDRATE':
      return action.state || { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: 'HYDRATE', state: JSON.parse(saved) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const add = (product, variant, quantity = 1) => dispatch({ type: 'ADD', product, variant, quantity });
  const remove = (key) => dispatch({ type: 'REMOVE', key });
  const updateQty = (key, quantity) => dispatch({ type: 'UPDATE_QTY', key, quantity });
  const clear = () => dispatch({ type: 'CLEAR' });
  const count = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, add, remove, updateQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);