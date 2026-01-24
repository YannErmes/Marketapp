import { useEffect } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import ProductCard from "@/components/ProductCard";

const Favorites = () => {
  const { favorites, remove } = useFavorites();

  useEffect(() => {
    document.title = `Favoris - Dardyali`;
  }, []);

  return (
    <div className="container px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Vos favoris</h1>

      {favorites.length === 0 ? (
        <div className="text-muted-foreground">Vous n'avez pas encore de favoris.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(p.id); }}
                className="absolute top-2 right-2 text-xs text-muted-foreground bg-white/80 rounded px-2 py-1"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
