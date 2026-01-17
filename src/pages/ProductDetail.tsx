import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, MapPin, MessageCircle, Share2, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { PlaceOrderModal } from "@/components/PlaceOrderModal";
import { useProduct } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import bgImage from "@/assets/bg-3.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id || "");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('product.loading')} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage 
          message={error?.message || t('product.errorLoading')} 
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">{t('product.productNotFound')}</p>
      </div>
    );
  }

  const images = product.additional_images.length > 0 
    ? product.additional_images 
    : [product.product_image_url];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi ${product.seller_name}! I'm interested in your product: ${product.product_name}`
    );
    const raw = product.seller_whatsapp || "";
    const whatsappNumber = raw.replace(/[^0-9]/g, '');
    if (!whatsappNumber || whatsappNumber.length < 7) {
      toast({
        title: t('product.invalidWhatsApp') || 'Invalid WhatsApp',
        description: t('product.invalidWhatsAppDesc') || 'Seller does not have a valid WhatsApp number.'
      });
      return;
    }

    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    console.log('Opening WhatsApp URL:', url);
    toast({ title: t('product.openingWhatsApp') || 'Opening WhatsApp', description: `Contacting ${product.seller_name}` });
    window.location.assign(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.product_name,
      text: `Check out ${product.product_name} by ${product.seller_name} on Foreign Market Morocco!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback - copy link
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('product.linkCopied'),
        description: t('product.linkCopiedDesc'),
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section with Background */}
      <section className="relative py-8 fade-bg">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Product Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        <div className="container px-4 relative z-10">
          <Link to="/marketplace" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('product.backToMarketplace')}
          </Link>
        </div>
      </section>

      <div className="container px-4 pb-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[currentImageIndex]}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`${product.product_name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.product_name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-primary text-primary mr-1" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </div>
              <div className="text-3xl font-bold mb-6">{product.price} MAD</div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <Link to={`/seller/${product.seller_name}`} className="flex items-center gap-3 group">
                  {product.seller_image && (
                    <img 
                      src={product.seller_image} 
                      alt={product.seller_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('product.soldBy')}</p>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {product.seller_name}
                    </p>
                    {product.seller_location && (
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {product.seller_location}
                      </p>
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('product.productDescription')}</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full btn-overlay" 
                size="lg"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t('product.contactSeller')}
              </Button>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                size="lg"
                onClick={() => setOrderModalOpen(true)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Place Order
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                {product.location_google_maps_link && (
                  <Button 
                    variant="outline"
                    onClick={() => setIsMapOpen(true)}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {t('product.viewLocation')}
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={handleShare}
                  className={!product.location_google_maps_link ? "col-span-2" : ""}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('product.shareProduct')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('product.productLocation')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src={product.location_google_maps_link}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => window.open(product.location_google_maps_link, "_blank")}
            >
              {t('product.openInGoogleMaps')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Place Order Modal */}
      <PlaceOrderModal 
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
        product={product}
      />
    </div>
  );
};

export default ProductDetail;
