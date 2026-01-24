import { Product } from "./productsApi";

const FAVORITES_KEY = 'dardyali_favorites_v1';

const read = (): Product[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read favorites', e);
    return [];
  }
};

const write = (items: Product[]) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { count: items.length } }));
  } catch (e) {
    console.error('Failed to write favorites', e);
  }
};

const getFavorites = (): Product[] => read();

const isFavorite = (id?: string | number) => {
  if (!id) return false;
  return read().some((p) => String(p.id) === String(id));
};

const addFavorite = (product: Product) => {
  const items = read();
  if (!items.some((p) => String(p.id) === String(product.id))) {
    const next = [product, ...items];
    write(next);
    return next;
  }
  return items;
};

const removeFavorite = (id?: string | number) => {
  if (!id) return read();
  const next = read().filter((p) => String(p.id) !== String(id));
  write(next);
  return next;
};

const toggleFavorite = (product: Product) => {
  if (isFavorite(product.id)) {
    return removeFavorite(product.id);
  }
  return addFavorite(product);
};

export default {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
};
