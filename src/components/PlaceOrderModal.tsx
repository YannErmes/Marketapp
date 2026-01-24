import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product } from '@/services/productsApi';
import { placeOrder } from '@/services/sellerApi';

interface PlaceOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function PlaceOrderModal({ open, onOpenChange, product }: PlaceOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    quantity: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.buyer_name || formData.quantity < 1) {
      setError('Please enter your name and select a quantity');
      setLoading(false);
      return;
    }

    // At least one of email or phone must be provided
    if (!formData.buyer_email && !formData.buyer_phone) {
      setError('Please provide either an email address or phone number');
      setLoading(false);
      return;
    }

    // Validate email format if provided
    if (formData.buyer_email && !formData.buyer_email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate phone format if provided (basic check - at least 8 digits)
    const phoneDigits = formData.buyer_phone.replace(/\D/g, '');
    if (formData.buyer_phone && phoneDigits.length < 8) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      const totalPrice = product.price * formData.quantity;
      
      await placeOrder({
        productId: product.id,
        sellerId: product.id.split('-')[0], // Extract seller ID if available
        seller_email: (product as any).seller_email || '', // Use seller_email from product when available
        seller_phone: product.seller_whatsapp || '',
        seller_name: product.seller_name,
        product_name: product.product_name,
        buyer_name: formData.buyer_name,
        buyer_email: formData.buyer_email,
        buyer_phone: formData.buyer_phone,
        quantity: formData.quantity,
        total_price: totalPrice,
      });

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setFormData({ buyer_name: '', buyer_email: '', buyer_phone: '', quantity: 1 });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
          <DialogDescription>
            {product.product_name} - {product.price} MAD
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Order placed successfully! Emails have been sent to you and the seller.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="buyer_name">Your Name *</Label>
              <Input
                id="buyer_name"
                name="buyer_name"
                type="text"
                placeholder="Full name"
                value={formData.buyer_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyer_email">Email Address</Label>
              <Input
                id="buyer_email"
                name="buyer_email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.buyer_email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyer_phone">Phone Number</Label>
              <Input
                id="buyer_phone"
                name="buyer_phone"
                type="tel"
                placeholder="+212 6XX XXX XXX"
                value={formData.buyer_phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max="100"
                value={formData.quantity}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Total Price:</span>
                <span className="text-lg font-bold text-blue-900">
                  {(product.price * formData.quantity)} MAD
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PlaceOrderModal;
