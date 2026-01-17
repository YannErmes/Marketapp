# Code Changes Summary - Order Email System

## Overview
This document shows exact code changes made to implement the dual-email order notification system.

---

## 1. Apps Script: New getSellerEmailByName() Function

**Location:** Apps Script (before PRODUCT OPERATIONS section)

**Code Added:**
```javascript
function getSellerEmailByName(seller_name, ss) {
  const sellersSheet = ss.getSheetByName('Sellers');
  if (!sellersSheet) {
    return createResponse(false, 'Seller not found');
  }

  const data = sellersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Match by seller_name (case-insensitive)
    if ((data[i][1] || '').toLowerCase() === (seller_name || '').toLowerCase()) {
      return createResponse(true, 'Seller found', {
        seller_email: data[i][2]
      });
    }
  }

  return createResponse(false, 'Seller not found');
}
```

**Purpose:** Looks up seller email by name from the Sellers sheet

**Parameters:**
- `seller_name` - Name of the seller to find
- `ss` - Google Sheets reference

**Returns:** Response object with seller_email if found

---

## 2. Apps Script: Updated placeOrder() Function

**Location:** Apps Script - PRODUCT OPERATIONS section

**Changes Made:**
- Added call to `sendOrderEmailToSeller()`
- Added call to `sendOrderEmailToAdmin()`

**Updated Code:**
```javascript
function placeOrder(data, ss) {
  // Get or create orders sheet
  let ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet('Orders');
    const headers = ['orderId', 'productId', 'sellerId', 'seller_email', 'buyer_name', 'buyer_email', 'quantity', 'total_price', 'createdAt'];
    ordersSheet.appendRow(headers);
  }

  const orderId = Utilities.getUuid();
  const createdAt = new Date().toISOString();

  // Append order
  ordersSheet.appendRow([
    orderId,
    data.productId || '',
    data.sellerId || '',
    data.seller_email || '',
    data.buyer_name || '',
    data.buyer_email || '',
    data.quantity || 1,
    data.total_price || 0,
    createdAt
  ]);

  // Send email to seller
  if (data.seller_email) {
    sendOrderEmailToSeller(data.seller_email, data.seller_name, data.product_name, data.buyer_name, data.buyer_email, data.quantity, data.total_price, orderId);
  }

  // Send email to admin (ermes1643@gmail.com)
  sendOrderEmailToAdmin('ermes1643@gmail.com', data.seller_name, data.product_name, data.buyer_name, data.buyer_email, data.quantity, data.total_price, orderId);

  return createResponse(true, 'Order placed successfully!', { orderId: orderId });
}
```

---

## 3. Apps Script: New sendOrderEmailToSeller() Function

**Location:** Apps Script - NOTIFICATION FUNCTIONS section

**Code Added:**
```javascript
function sendOrderEmailToSeller(sellerEmail, sellerName, productName, buyerName, buyerEmail, quantity, totalPrice, orderId) {
  try {
    const subject = `New Order #${orderId}`;
    const body = `
      Hi ${sellerName},

      You have received a new order!

      Order ID: ${orderId}
      Product: ${productName}
      Buyer Name: ${buyerName}
      Buyer Email: ${buyerEmail}
      Quantity: ${quantity}
      Total Price: ${totalPrice} DH

      Please follow up with the buyer to complete the transaction.

      Best regards,
      ForeignFinds Morocco Team
    `;

    MailApp.sendEmail(sellerEmail, subject, body);
  } catch (error) {
    Logger.log('Error sending email to seller: ' + error);
  }
}
```

**Purpose:** Sends order notification email to seller

---

## 4. Apps Script: New sendOrderEmailToAdmin() Function

**Location:** Apps Script - NOTIFICATION FUNCTIONS section

**Code Added:**
```javascript
function sendOrderEmailToAdmin(adminEmail, sellerName, productName, buyerName, buyerEmail, quantity, totalPrice, orderId) {
  try {
    const subject = `New Order Received #${orderId}`;
    const body = `
      New order received on ForeignFinds Morocco!

      Order ID: ${orderId}
      Seller: ${sellerName}
      Product: ${productName}
      Buyer Name: ${buyerName}
      Buyer Email: ${buyerEmail}
      Quantity: ${quantity}
      Total Price: ${totalPrice} DH

      Please monitor this order and ensure timely completion.

      Best regards,
      ForeignFinds Morocco System
    `;

    MailApp.sendEmail(adminEmail, subject, body);
  } catch (error) {
    Logger.log('Error sending email to admin: ' + error);
  }
}
```

**Purpose:** Sends order notification email to admin at ermes1643@gmail.com

---

## 5. Apps Script: Updated doGet() Handler

**Location:** Apps Script - HTTP HANDLERS section

**Change:** Added handler for `get_seller_email_by_name` action

**Code Added to doGet():**
```javascript
else if (action === 'get_seller_email_by_name' && seller_name) {
  return getSellerEmailByName(seller_name, ss);
}
```

**Context:** This allows frontend to fetch seller email by name via GET request

---

## 6. Frontend: New PlaceOrderModal.tsx Component

**Location:** `src/components/PlaceOrderModal.tsx`

**File Created:** Complete new component (184 lines)

**Key Code Sections:**

### Imports
```tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product } from '@/services/productsApi';
import { placeOrder, getSellerEmailByName } from '@/services/sellerApi';
```

### Form Submission Handler
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (!formData.buyer_name || !formData.buyer_email || formData.quantity < 1) {
    setError('Please fill in all fields correctly');
    setLoading(false);
    return;
  }

  try {
    const totalPrice = product.price * formData.quantity;
    
    // Get seller email by name
    const sellerEmail = await getSellerEmailByName(product.seller_name);
    
    await placeOrder({
      productId: product.id,
      sellerId: product.id.split('-')[0],
      seller_email: sellerEmail || '',
      seller_name: product.seller_name,
      product_name: product.product_name,
      buyer_name: formData.buyer_name,
      buyer_email: formData.buyer_email,
      quantity: formData.quantity,
      total_price: totalPrice,
    });

    setSuccess(true);
    setTimeout(() => {
      onOpenChange(false);
      setFormData({ buyer_name: '', buyer_email: '', quantity: 1 });
      setSuccess(false);
    }, 2000);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to place order');
  } finally {
    setLoading(false);
  }
};
```

---

## 7. Frontend: Updated ProductCard.tsx

**Location:** `src/components/ProductCard.tsx`

**Changes Made:**

### Imports Added
```tsx
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { PlaceOrderModal } from './PlaceOrderModal';
```

### State Added
```tsx
const [orderModalOpen, setOrderModalOpen] = useState(false);
```

### Updated CardFooter
**Before:**
```tsx
<CardFooter>
  <Button 
    className="w-full" 
    onClick={handleContactSeller}
  >
    Contact Seller
  </Button>
</CardFooter>
```

**After:**
```tsx
<CardFooter className="gap-2">
  <Button 
    className="flex-1" 
    onClick={handleContactSeller}
  >
    Contact Seller
  </Button>
  <Button 
    className="flex-1 bg-green-600 hover:bg-green-700"
    onClick={() => setOrderModalOpen(true)}
  >
    <ShoppingCart className="mr-2 h-4 w-4" />
    Place Order
  </Button>
  <PlaceOrderModal 
    open={orderModalOpen} 
    onOpenChange={setOrderModalOpen}
    product={product}
  />
</CardFooter>
```

---

## 8. Frontend: Updated sellerApi.ts

**Location:** `src/services/sellerApi.ts`

**Function Added:**
```typescript
export const getSellerEmailByName = async (sellerName: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `${APPS_SCRIPT_URL}?action=get_seller_email_by_name&seller_name=${encodeURIComponent(sellerName)}`
    );
    const data = await response.json();
    
    if (data.success && data.data?.seller_email) {
      return data.data.seller_email;
    }
    return null;
  } catch (error) {
    console.error('Error fetching seller email:', error);
    return null;
  }
};
```

**Purpose:** Fetches seller email from Google Sheet by seller name

---

## Summary of Modifications

| File | Type | Changes |
|------|------|---------|
| APPS_SCRIPT_DEPLOYMENT.md | Backend | Added 3 new functions, updated 1 existing function, updated 1 handler |
| PlaceOrderModal.tsx | Frontend | NEW component (184 lines) |
| ProductCard.tsx | Frontend | Added button and modal integration |
| sellerApi.ts | Frontend | Added getSellerEmailByName() function |

---

## Verification Checklist

After making these changes:

- [ ] All 3 new Apps Script functions added
- [ ] placeOrder() updated to call both email functions
- [ ] doGet() handler includes get_seller_email_by_name action
- [ ] PlaceOrderModal.tsx file created in correct location
- [ ] ProductCard.tsx updated with Place Order button
- [ ] sellerApi.ts has getSellerEmailByName() exported
- [ ] No syntax errors in any file
- [ ] Import statements are correct
- [ ] Component props match interface definitions

---

## Testing Verification

After deployment, test these specific scenarios:

### Test 1: Fetch Seller Email
```javascript
// In browser console, after login
fetch('YOUR_APPS_SCRIPT_URL?action=get_seller_email_by_name&seller_name=YourSellerName')
  .then(r => r.json())
  .then(d => console.log(d))
```

Expected: `{ success: true, message: 'Seller found', data: { seller_email: 'seller@example.com' } }`

### Test 2: Place Order
Click "Place Order" button on product → Fill form → Submit

Expected: 
- Success message appears
- Seller receives email
- Admin receives email
- Order in Google Sheets

### Test 3: Error Handling
Submit form with invalid email format

Expected: Error message "Please fill in all fields correctly"

---

**All changes are backward compatible and don't break existing functionality.**

