import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById, Product } from "@/services/productsApi";

export const useProducts = (sellerName?: string) => {
  return useQuery({
    queryKey: ["products", sellerName],
    queryFn: () => fetchProducts(sellerName),
    // Cache products in memory for the session to avoid reloading on route changes
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours in case we want to reuse across sessions
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export type { Product };
