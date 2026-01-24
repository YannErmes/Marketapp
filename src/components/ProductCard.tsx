import { Star, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { PlaceOrderModal } from "./PlaceOrderModal";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Product } from "@/services/productsApi";
import { useToast } from "@/hooks/use-toast";
import Shimmer from "./Shimmer";
import { useQueryClient } from "@tanstack/react-query";
import { fetchProductById } from "@/services/productsApi";
import favoritesService from "@/services/favorites";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [orderOpen, setOrderOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [sellerImgLoaded, setSellerImgLoaded] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const handlePrefetch = () => {
    import("../pages/ProductDetail").catch(() => {});
    if (product.id) {
      queryClient
        .prefetchQuery(["product", product.id], () => fetchProductById(product.id), {
          staleTime: 5 * 60 * 1000,
        })
        .catch(() => {});
    }
  };
  
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.seller_whatsapp) {
      toast({ title: t('error.noWhatsAppTitle'), description: t('error.noWhatsAppDescription') });
      return;
    }
    const message = encodeURIComponent(t('whatsapp.message', {
      sellerName: product.seller_name,
      productName: product.product_name,
    }));
    const whatsappNumber = (product.seller_whatsapp || '').replace(/[^0-9]/g, '');
    if (!whatsappNumber || whatsappNumber.length < 8) {
      toast({ title: t('error.invalidNumberTitle'), description: t('error.invalidNumberDescription') });
      return;
    }
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    console.log('Opening WhatsApp URL:', url);
    toast({ title: t('toast.openingWhatsAppTitle'), description: t('toast.openingWhatsAppDescription', { sellerName: product.seller_name }) });
    window.location.assign(url);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      onMouseEnter={handlePrefetch}
    >
      <Card className="product-card overflow-hidden h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imgLoaded && (
            <div className="absolute inset-0">
              <Shimmer className="w-full h-full" />
            </div>
          )}
          <img
            src={product.product_image_url}
            alt={product.product_name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`object-cover w-full h-full transition-transform duration-300 hover:scale-105 transition-opacity ease-in-out ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
          {product.isBestSeller && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              {t('product.bestSeller')}
            </div>
          )}
        </div>
        
        <CardContent className="p-2 md:p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-1 md:mb-2">
            <h3 className="font-semibold text-xs md:text-sm line-clamp-2 flex-1">
              {product.product_name}
            </h3>
            <div className="flex items-center ml-1 md:ml-2 shrink-0">
              <Star className="h-3 w-3 fill-primary text-primary mr-0.5 md:mr-1" />
              <span className="text-[10px] md:text-xs font-medium">{product.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            {product.seller_image && (
              <div className="relative w-4 h-4 md:w-5 md:h-5 rounded-full overflow-hidden">
                {!sellerImgLoaded && <Shimmer className="w-full h-full" />}
                <img
                  src={product.seller_image}
                  alt={product.seller_name}
                  loading="lazy"
                  onLoad={() => setSellerImgLoaded(true)}
                  className={`w-full h-full object-cover rounded-full ${sellerImgLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            )}
            <Link 
              to={`/seller/${product.seller_name}`}
              className="text-[10px] md:text-xs text-muted-foreground hover:text-primary transition-colors truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {product.seller_name}
            </Link>
          </div>

          {product.seller_location && (
            <p className="text-[9px] md:text-[10px] text-muted-foreground truncate mb-1">
              📍 {product.seller_location}
            </p>
          )}
          
          <div className="mt-auto pt-2 md:pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-lg font-bold">{product.price} MAD</span>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{product.category}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-2 md:p-4 pt-0 flex flex-col gap-2">
          <Button 
            className="w-full btn-overlay text-xs md:text-sm"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // Use callback if provided, otherwise add directly
              if (onAddToCart) {
                onAddToCart(product);
              } else {
                import("@/services/cart").then((m) => {
                  m.default.addToCart(product, 1);
                }).catch(() => {});
              }

              toast({ title: 'Added to cart', description: product.product_name });
            }}
          >
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </Button>

          <Button 
            className="w-full btn-overlay text-xs md:text-sm"
            size="sm"
            onClick={() => setOrderOpen(true)}
            variant="secondary"
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Place Order</span>
            <span className="sm:hidden">Order</span>
          </Button>

          <Button 
            className="w-full btn-overlay text-xs md:text-sm"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const added = !favoritesService.isFavorite(product.id);
              if (added) favoritesService.addFavorite(product);
              else favoritesService.removeFavorite(product.id);

              // trigger update event and toast
              window.dispatchEvent(new CustomEvent('favoritesUpdated'));
              toast({ title: added ? 'Ajouté aux favoris' : 'Retiré des favoris', description: product.product_name });
            }}
          >
            <Heart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">{t('product.addToFavorites') || 'Ajouter aux favoris'}</span>
            <span className="sm:hidden">Fav</span>
          </Button>

          <PlaceOrderModal open={orderOpen} onOpenChange={setOrderOpen} product={product} />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
