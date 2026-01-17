import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockProducts, Product } from "@/data/mockProducts";
import cartService from "@/services/cart";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Product {
  quantity: number;
}

const Cart = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => cartService.getCart());

  // Listen for cart updates from other pages/components
  useEffect(() => {
    const handler = (e: any) => {
      setCartItems(cartService.getCart());
    };
    window.addEventListener('cartUpdated', handler as EventListener);
    return () => window.removeEventListener('cartUpdated', handler as EventListener);
  }, []);

  const updateQuantity = (id: string, change: number) => {
    const updated = cartService.updateQuantity(id, (cartItems.find(i => i.id === id)?.quantity || 1) + change);
    setCartItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartService.removeFromCart(id);
    setCartItems(updated);
  };

  const handleContactSeller = (product: Product) => {
    const quantity = cartItems.find(i => i.id === product.id)?.quantity || 1;
    const message = encodeURIComponent(
      `Hi ${product.seller_name}! I'm interested in purchasing: ${product.product_name} (Quantity: ${quantity})`
    );
    const raw = product.seller_whatsapp || "";
    const whatsappNumber = raw.replace(/[^0-9]/g, '');
    if (!whatsappNumber || whatsappNumber.length < 7) {
      toast({ title: t('product.invalidWhatsApp') || 'Invalid WhatsApp', description: t('product.invalidWhatsAppDesc') || 'Seller does not have a valid WhatsApp number.' });
      return;
    }
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    console.log('Opening WhatsApp URL:', url);
    toast({ title: t('product.openingWhatsApp') || 'Opening WhatsApp', description: `Contacting ${product.seller_name}` });
    window.location.assign(url);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{t('cart.empty')}</h2>
          <p className="text-muted-foreground">{t('cart.emptyDesc')}</p>
          <Link to="/marketplace">
            <Button>{t('home.browseMarketplace')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('cart.title')}</h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <img
                      src={item.product_image_url}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                        {item.product_name}
                      </h3>
                    </Link>
                    <Link
                      to={`/seller/${item.seller_name}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t('product.by')} {item.seller_name}
                    </Link>
                    <p className="text-lg font-bold mt-2">{item.price} MAD</p>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button
                    className="w-full sm:w-auto"
                    variant="outline"
                    onClick={() => handleContactSeller(item)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('cart.talkToSeller')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span className="font-semibold">{total} MAD</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t pt-4">
                <span>{t('cart.total')}</span>
                <span>{total} MAD</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('cart.note')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
