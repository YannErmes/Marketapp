import { Product } from "./productsApi";

const CART_KEY = "ff_cart";

export interface CartItem extends Product {
  quantity: number;
}

const read = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch (e) {
    return [];
  }
};

const write = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Dispatch a global event so UI can react (header cart count, etc.)
  try {
    const event = new CustomEvent('cartUpdated', { detail: { items, count: items.reduce((s, i) => s + (i.quantity || 0), 0) } });
    window.dispatchEvent(event);
  } catch (e) {
    // ignore
  }
};

export const getCart = (): CartItem[] => read();

export const clearCart = (): void => write([]);

export const addToCart = (product: Product, qty = 1): CartItem[] => {
  const items = read();
  const idx = items.findIndex((i) => i.id === product.id);
  if (idx > -1) {
    items[idx].quantity = Math.max(1, items[idx].quantity + qty);
  } else {
    items.push({ ...product, quantity: qty });
  }
  write(items);
  return items;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const items = read().filter((i) => i.id !== productId);
  write(items);
  return items;
};

export const updateQuantity = (productId: string, quantity: number): CartItem[] => {
  const items = read();
  const idx = items.findIndex((i) => i.id === productId);
  if (idx > -1) {
    items[idx].quantity = Math.max(1, quantity);
    write(items);
  }
  return items;
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
};
