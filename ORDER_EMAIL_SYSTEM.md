# Order Email Notification System

## Overview
The complete order system sends emails to both the seller and the admin (ermes1643@gmail.com) when a customer places an order.

## System Architecture

### Frontend Flow
1. Customer clicks **"Place Order"** button on a product card
2. **PlaceOrderModal** component opens with order form
3. Form collects: buyer name, buyer email, quantity
4. On submit:
   - Fetches seller email via `getSellerEmailByName()` 
   - Calls `placeOrder()` API with all order details
   - Shows success message or error
   - Auto-closes after 2 seconds

### Backend Flow (Apps Script)
1. **placeOrder()** receives order data
2. Stores order in Google Sheets "Orders" sheet
3. Calls **sendOrderEmailToSeller()** - Email to seller
4. Calls **sendOrderEmailToAdmin()** - Email to ermes1643@gmail.com
5. Returns success response with order ID

## Component Details

### PlaceOrderModal.tsx
**Location:** `src/components/PlaceOrderModal.tsx`

**Props:**
- `open: boolean` - Modal visibility
- `onOpenChange: (open: boolean) => void` - Close handler
- `product: Product` - Product being ordered

**Key Functions:**
- `getSellerEmailByName()` - Fetches seller email from Sellers sheet
- `placeOrder()` - Submits order to Apps Script

**Form Fields:**
- Buyer Name (text input)
- Buyer Email (email input)
- Quantity (number input, min 1)
- Total Price (calculated, read-only)

**Success/Error States:**
- Success: Green alert with message, auto-closes after 2s
- Error: Red alert with error message, stays open

### placeOrder() Function
**Location:** Apps Script - APPS_SCRIPT_DEPLOYMENT.md

**Parameters:**
```javascript
{
  productId: string,
  sellerId: string,
  seller_email: string,
  seller_name: string,
  product_name: string,
  buyer_name: string,
  buyer_email: string,
  quantity: number,
  total_price: number
}
```

**Process:**
1. Creates Orders sheet if doesn't exist
2. Generates UUID for orderId
3. Appends order row to sheet
4. Calls sendOrderEmailToSeller()
5. Calls sendOrderEmailToAdmin()
6. Returns success with orderId

### getSellerEmailByName() Function
**Location:** Apps Script - APPS_SCRIPT_DEPLOYMENT.md

**Purpose:** Lookup seller email by name from Sellers sheet

**Parameters:**
- `seller_name: string` - Name to search for (case-insensitive)
- `ss: Spreadsheet` - Google Sheet reference

**Returns:**
```javascript
{
  success: true,
  message: 'Seller found',
  data: { seller_email: 'seller@example.com' }
}
```

### Email Functions

#### sendOrderEmailToSeller()
Sends order notification to seller email

**Recipients:** seller's email address

**Subject:** `New Order #${orderId}`

**Content Includes:**
- Order ID
- Product name
- Buyer name and email
- Quantity
- Total price

#### sendOrderEmailToAdmin()
Sends order notification to admin

**Recipients:** ermes1643@gmail.com

**Subject:** `New Order Received #${orderId}`

**Content Includes:**
- Order ID
- Seller name
- Product name
- Buyer name and email
- Quantity
- Total price

## Integration Points

### ProductCard.tsx
- Shows "Place Order" button (green, ShoppingCart icon)
- Opens PlaceOrderModal on click
- Passes product data to modal

### sellerApi.ts
- `getSellerEmailByName()` - GET request to Apps Script
- `placeOrder()` - POST request to Apps Script

## Database Schema

### Orders Sheet
Columns:
- A: orderId (UUID)
- B: productId (string)
- C: sellerId (string)
- D: seller_email (string)
- E: buyer_name (string)
- F: buyer_email (string)
- G: quantity (number)
- H: total_price (number)
- I: createdAt (ISO timestamp)

### Sellers Sheet (Used for lookup)
Must contain:
- Column B: seller_name
- Column C: seller_email

## Error Handling

### Frontend
- Form validation (required fields, valid email)
- Try-catch for API calls
- User-friendly error messages
- Loading state during submission

### Backend
- Sheet access validation
- Email send error logging
- Graceful response creation

## Email Delivery

### Seller Email
- Notifies seller of new order
- Includes buyer contact info
- Includes product and quantity details
- Urges prompt follow-up

### Admin Email
- Notifies admin of all orders
- Includes seller name for context
- Includes buyer contact info
- Includes monitoring note

## Testing Checklist

- [ ] Product page shows "Place Order" button
- [ ] Clicking button opens modal with order form
- [ ] Form validation works (required fields, email format)
- [ ] Submitting form:
  - [ ] Fetches seller email successfully
  - [ ] Creates order in Google Sheets
  - [ ] Seller receives email
  - [ ] Admin (ermes1643@gmail.com) receives email
  - [ ] Success message shows for 2 seconds
  - [ ] Modal closes automatically

## Troubleshooting

### Orders not appearing in Google Sheets
- Check Orders sheet exists in spreadsheet
- Verify Apps Script has proper sheet access
- Check browser console for API errors

### Emails not being sent
- Verify Google Apps Script has MailApp permissions
- Check sender email in MailApp settings
- Check recipient emails are correct
- Review Apps Script logs for errors

### Seller email not found
- Verify seller_name in product matches exactly (case-sensitive in lookup)
- Check Sellers sheet has seller_email in column C
- Verify seller name is in Sellers sheet

## Security Considerations

- Order data stored in Google Sheets (secure)
- Email addresses visible to seller and admin only
- No payment processing (manual coordination)
- Seller email fetched server-side (secure)

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Order tracking/status updates
- [ ] Buyer confirmation email
- [ ] Order history in customer account
- [ ] Seller order management dashboard
- [ ] Automated order status notifications

