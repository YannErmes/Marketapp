import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import Shimmer from "@/components/Shimmer";
import ErrorMessage from "@/components/ErrorMessage";
import StatsBar from "@/components/StatsBar";
import { useProducts, Product } from "@/hooks/useProducts";
import { getCategories, getSellers } from "@/services/productsApi";
import { useToast } from "@/hooks/use-toast";
import cartService from "@/services/cart";
import bgImage from "@/assets/bg-2.jpg";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSeller, setSelectedSeller] = useState("All Sellers");
  const [sortBy, setSortBy] = useState("trending");
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data, isLoading, isError, error, refetch } = useProducts();

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;
  const totalPrice = data?.totalPrice || 0;

  const sellers = useMemo(() => getSellers(products), [products]);
  const categories = useMemo(() => getCategories(products), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by seller (search functionality)
    if (selectedSeller !== "All Sellers" && selectedSeller.trim() !== "") {
      const searchTerm = selectedSeller.toLowerCase();
      filtered = filtered.filter((p) => 
        p.seller_name.toLowerCase().includes(searchTerm)
      );
    }

    // Sort products
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [products, selectedCategory, selectedSeller, sortBy]);

  const handleAddToCart = (product: Product) => {
    cartService.addToCart(product, 1);
    toast({
      title: t('product.addedToCart'),
      description: `${product.product_name} ${t('product.addedToCartDesc')}`,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header Section with Background */}
      <section className="relative py-16 md:py-24 fade-bg">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Marketplace Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        <div className="container px-4 relative z-10">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('marketplace.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('marketplace.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        {isLoading ? (
          <div className="space-y-6">
            <div className="mb-6">
              <Shimmer className="h-8 w-1/3 rounded-md" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="col-span-4">
                <Shimmer className="h-10 w-full rounded-md mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden bg-muted">
                      <Shimmer className="w-full h-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isError ? (
          <ErrorMessage 
            message={error?.message || t('marketplace.errorLoading')} 
            onRetry={() => refetch()} 
          />
        ) : (
          <>
            <StatsBar totalProducts={totalProducts} totalPrice={totalPrice} />

            <FilterBar
              selectedCategory={selectedCategory}
              selectedSeller={selectedSeller}
              sortBy={sortBy}
              onCategoryChange={setSelectedCategory}
              onSellerChange={setSelectedSeller}
              onSortChange={setSortBy}
              sellers={sellers}
              categories={categories}
            />

            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {t('marketplace.showing')} {filteredProducts.length} {t('marketplace.products')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">
                  {t('marketplace.noProducts')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
