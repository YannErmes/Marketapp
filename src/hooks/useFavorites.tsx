import { useEffect, useState } from "react";
import favoritesService from "@/services/favorites";
import { Product } from "@/services/productsApi";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>(() => favoritesService.getFavorites());

  useEffect(() => {
    const handler = () => setFavorites(favoritesService.getFavorites());
    window.addEventListener('favoritesUpdated', handler as EventListener);
    return () => window.removeEventListener('favoritesUpdated', handler as EventListener);
  }, []);

  const toggle = (product: Product) => favoritesService.toggleFavorite(product);
  const remove = (id?: string | number) => favoritesService.removeFavorite(id);
  const isFav = (id?: string | number) => favoritesService.isFavorite(id);

  return { favorites, toggle, remove, isFav };
};

export default useFavorites;