# Quick Reference - Order Email System

## 🚀 What Was Added

**Dual Email Notification System** - When a customer places an order, emails are sent to:
1. **Seller** - Order notification with buyer details
2. **Admin** (ermes1643@gmail.com) - Order summary for monitoring

## 📋 Components

### Frontend
- **PlaceOrderModal.tsx** - Modal with order form (name, email, quantity)
- **ProductCard.tsx** - Green "Place Order" button
- **sellerApi.ts** - getSellerEmailByName() function

### Backend (Apps Script)
- **getSellerEmailByName()** - Looks up seller email by name
- **placeOrder()** - Now sends 2 emails (seller + admin)
- **sendOrderEmailToSeller()** - Email to seller
- **sendOrderEmailToAdmin()** - Email to admin
- **doGet()** - Handles get_seller_email_by_name action

## ⚡ Quick Setup

### 1. Deploy Apps Script
```
Copy code from: APPS_SCRIPT_DEPLOYMENT.md
Deploy as: Web app
Permissions: Anyone (MailApp will prompt)
```

### 2. Test Locally
```bash
npm run dev
# Navigate to Marketplace
# Click "Place Order" on a product
# Fill form and submit
# Check emails
```

### 3. Deploy to Production
```bash
npm run build
# Deploy to your hosting
```

## 📧 Email Recipients

| Email Type | Recipient | Contains |
|-----------|-----------|----------|
| Order Confirmation | Seller email | Order ID, product, buyer info, quantity, price |
| Order Notification | ermes1643@gmail.com | All above + seller name |

## 🔍 Testing Checklist

- [ ] Product page loads (no GViz errors)
- [ ] "Place Order" button visible
- [ ] Modal opens when clicked
- [ ] Form validates (required fields, email format)
- [ ] Total price calculates correctly
- [ ] Submit button shows loading state
- [ ] Success message appears
- [ ] Seller receives email
- [ ] Admin receives email
- [ ] Order saved in Google Sheets

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| GViz JSON error | Check productsApi.ts regex |
| Seller email not found | Verify seller_name in Sellers sheet |
| Emails not sent | Check Apps Script MailApp permissions |
| Modal won't open | Check browser console for errors |
| Orders not saved | Verify Orders sheet exists |

## 📍 File Locations

**Created:**
- `src/components/PlaceOrderModal.tsx`
- `ORDER_EMAIL_SYSTEM.md`
- `DEPLOYMENT_GUIDE_ORDER_SYSTEM.md`
- `CODE_CHANGES_SUMMARY.md`
- `ORDER_SYSTEM_COMPLETE.md`
- `QUICK_REFERENCE.md` (this file)

**Updated:**
- `src/components/ProductCard.tsx`
- `src/services/sellerApi.ts`
- `APPS_SCRIPT_DEPLOYMENT.md`

## 🎯 Order Flow

```
Customer → Place Order Button
       ↓
PlaceOrderModal Form
       ↓
Fetch Seller Email
       ↓
Submit Order to Apps Script
       ↓
Save to Google Sheets
       ↓
Send Email to Seller ✉️
       ↓
Send Email to Admin ✉️
       ↓
Success Message
```

## 💾 Data Structure

### Orders Sheet (Google Sheets)
```
orderId | productId | sellerId | seller_email | buyer_name | buyer_email | quantity | total_price | createdAt
```

## 🔑 Key Functions

### Frontend
```tsx
// Fetch seller email
const email = await getSellerEmailByName('Ahmed Shop');

// Place order
await placeOrder({
  productId, sellerId, seller_email, seller_name,
  product_name, buyer_name, buyer_email, quantity, total_price
});
```

### Apps Script
```javascript
// Lookup seller
getSellerEmailByName(seller_name, ss);

// Place order (sends 2 emails)
placeOrder(data, ss);

// Email functions
sendOrderEmailToSeller(sellerEmail, sellerName, ...);
sendOrderEmailToAdmin(adminEmail, sellerName, ...);
```

## ✅ Validation Rules

### Form Input
- Buyer Name: Required, non-empty
- Buyer Email: Required, valid email format
- Quantity: Required, >= 1

### Data Validation
- Product exists and has price
- Seller name exists in Sellers sheet
- Total price = price × quantity

## 📱 UI Elements

**Place Order Button**
- Color: Green (bg-green-600)
- Icon: Shopping cart (ShoppingCart)
- Location: Product card footer (next to Contact Seller)
- Opens: PlaceOrderModal on click

**Modal**
- Dialog box with form
- Three input fields (name, email, quantity)
- Display total price (read-only)
- Submit button with loading state
- Success/error messages

## 🔐 Security Notes

- Seller email fetched server-side (not hardcoded)
- Order data stored in Google Sheets
- MailApp permissions required (auto-prompt)
- Email validation on frontend
- No payment processing (manual coordination)

## 📞 Support

For issues, check:
1. Browser console (F12) for errors
2. Apps Script Executions tab for function errors
3. Email spam folder for delivery issues
4. Google Sheets for data persistence

## 📖 Full Documentation

- **ORDER_EMAIL_SYSTEM.md** - Complete system details
- **DEPLOYMENT_GUIDE_ORDER_SYSTEM.md** - Step-by-step deployment
- **CODE_CHANGES_SUMMARY.md** - Exact code changes
- **ORDER_SYSTEM_COMPLETE.md** - Implementation overview

---

**Status:** ✅ Ready to Deploy
**Last Update:** Today

