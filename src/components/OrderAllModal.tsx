import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import cartService from '@/services/cart';
import { placeBulkOrder } from '@/services/sellerApi';

export function OrderAllModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ buyer_name: '', buyer_email: '', buyer_phone: '' });

  const items = cartService.getCart();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.buyer_name) {
      setError('Please enter your name');
      return;
    }
    if (!form.buyer_email && !form.buyer_phone) {
      setError('Please provide either an email or phone');
      return;
    }

    setLoading(true);

    try {
      const payloadItems = items.map((item) => ({
        productId: item.id,
        sellerId: item.id.split('-')[0],
        seller_email: (item as any).seller_email || '',
        seller_phone: (item as any).seller_whatsapp || '',
        seller_name: (item as any).seller_name || '',
        product_name: item.product_name,
        quantity: item.quantity || 1,
        total_price: (item.price || 0) * (item.quantity || 1),
      }));

      const result = await placeBulkOrder({
        buyer_name: form.buyer_name,
        buyer_email: form.buyer_email,
        buyer_phone: form.buyer_phone,
        items: payloadItems,
      });

      if (!result || !result.success) {
        setError(result?.message || 'Failed to place orders.');
      } else {
        setSuccess(true);
        cartService.clearCart();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: [], count: 0 } }));
      }

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to place orders: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order All Items</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">Orders placed successfully. Sellers and admin have been notified.</AlertDescription>
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
              <Input id="buyer_name" name="buyer_name" value={form.buyer_name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyer_email">Email</Label>
              <Input id="buyer_email" name="buyer_email" value={form.buyer_email} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyer_phone">Phone</Label>
              <Input id="buyer_phone" name="buyer_phone" value={form.buyer_phone} onChange={handleChange} />
            </div>

            <div className="border rounded p-3">
              <div className="text-sm font-semibold mb-2">Items to order:</div>
              <ul className="space-y-1 text-sm">
                {items.map(i => (
                  <li key={i.id} className="flex justify-between">
                    <span>{i.product_name} x {i.quantity}</span>
                    <span className="font-medium">{(i.price * (i.quantity || 1)).toFixed(2)} MAD</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Placing Orders...' : 'Order All'}</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default OrderAllModal;
