import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import CultureSection from "@/components/CultureSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useProducts, Product } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import cartService from "@/services/cart";
import heroImage from "@/assets/bg-1.jpg";

const Home = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = useProducts();

  const products = data?.products || [];

  // Get best sellers (top rated or most sales)
  const bestSellers = products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleAddToCart = (product: Product) => {
    cartService.addToCart(product, 1);
    toast({
      title: t('product.addedToCart'),
      description: `${product.product_name} ${t('product.addedToCartDesc')}`,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden fade-bg">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Foreign Market Morocco - Moroccan Market Scene" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        <div className="container relative z-10 text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in">
            {t('home.welcome')} <span className="text-primary">{t('home.brandName')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('home.tagline')}
          </p>
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/marketplace">
              <Button size="lg" className="btn-overlay">
                {t('home.browseMarketplace')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Notes */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.tasteOfHome')}</h2>
            <p className="text-muted-foreground">
              {t('home.tasteOfHomeDesc')}
              <strong className="text-foreground"> {t('home.tasteOfHomeHighlight')}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('home.bestSellers')}</h2>
              <p className="text-muted-foreground">{t('home.bestSellersDesc')}</p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline">
                {t('home.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <LoadingSpinner text={t('marketplace.loading')} />
          ) : isError ? (
            <ErrorMessage 
              message={error?.message || t('marketplace.errorLoading')} 
              onRetry={() => refetch()} 
            />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {bestSellers.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Culture Section */}
      <CultureSection />

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.readyToExplore')}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t('home.readyToExploreDesc')}
          </p>
          <Link to="/marketplace">
            <Button size="lg" variant="secondary" className="btn-overlay">
              {t('home.startShopping')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
