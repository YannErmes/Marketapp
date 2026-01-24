import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, ChevronLeft, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Shimmer from "@/components/Shimmer";
import ErrorMessage from "@/components/ErrorMessage";
import { useProducts, Product } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import cartService from "@/services/cart";
import bgImage from "@/assets/bg-4.jpg";

const SellerProfile = () => {
  const { sellerName } = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { data, isLoading, isError, error, refetch } = useProducts();
  const products = data?.products || [];

  const sellerProducts = products.filter(
    (p) => p.seller_name === sellerName
  );

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container px-4 py-8">
          <div className="bg-card border rounded-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Shimmer className="w-full h-full" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-3">
                <Shimmer className="h-6 w-1/3 rounded-md" />
                <Shimmer className="h-4 w-1/4 rounded-md" />
                <Shimmer className="h-8 w-40 rounded-md" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden bg-muted">
                <Shimmer className="w-full h-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage 
          message={error?.message || t('seller.errorLoading')} 
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  if (sellerProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">{t('seller.notFound')}</p>
      </div>
    );
  }

  const seller = sellerProducts[0];
  const avgRating = (
    sellerProducts.reduce((sum, p) => sum + p.rating, 0) / sellerProducts.length
  ).toFixed(1);

  const handleAddToCart = (product: Product) => {
    cartService.addToCart(product, 1);
    toast({
      title: t('product.addedToCart'),
      description: `${product.product_name} ${t('product.addedToCartDesc')}`,
    });
  };

  const handleContactSeller = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to know more about your products on Dardyali.`
    );
    const whatsappNumber = seller.seller_whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Header Section with Background */}
      <section className="relative py-8 fade-bg">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Seller Profile Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        <div className="container px-4 relative z-10">
          <Link to="/marketplace" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('seller.backToMarketplace')}
          </Link>
        </div>
      </section>

      <div className="container px-4 pb-12">
        {/* Seller Header */}
        <div className="bg-card border rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {seller.seller_image && (
              <img
                src={seller.seller_image}
                alt={seller.seller_name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {seller.seller_name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-primary text-primary mr-1" />
                  <span className="font-semibold">{avgRating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {sellerProducts.length} {t('seller.products')}
                </span>
              </div>
              {seller.seller_location && (
                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {seller.seller_location}
                </p>
              )}
              <Button onClick={handleContactSeller} className="btn-overlay">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('seller.contactSeller')}
              </Button>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">{t('seller.productsFromSeller')}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {sellerProducts.map((product) => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
