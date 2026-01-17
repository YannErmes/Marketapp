# Complete Deployment Guide - Order Email System

## Step 1: Deploy Apps Script Changes

### Copy the Updated Code
1. Open your Google Apps Script editor (in the same spreadsheet)
2. Replace the entire content with the code from `APPS_SCRIPT_DEPLOYMENT.md`
3. Key functions to verify are present:
   - `doGet()` - HTTP GET handler with `get_seller_email_by_name` action
   - `doPost()` - HTTP POST handler
   - `placeOrder()` - Updated to send dual emails
   - `getSellerEmailByName()` - New function to lookup seller email
   - `sendOrderEmailToSeller()` - New sender for seller notifications
   - `sendOrderEmailToAdmin()` - New sender for admin notifications

### Deploy the Script
1. Click **Deploy** → **New deployment**
2. Select **Type**: "Web app"
3. Select **Execute as**: Your Google account
4. Select **Who has access**: "Anyone"
5. Click **Deploy**
6. Copy the new **Deployment ID** and **Execution URL**
7. Update your React environment with the new URL if needed

### Test the Deployment
```bash
# Test the doGet handler with get_seller_email_by_name action
curl "YOUR_SCRIPT_URL?action=get_seller_email_by_name&seller_name=TestSeller"
```

## Step 2: Verify Frontend Files

### Check All Components Are in Place
1. ✅ `src/components/PlaceOrderModal.tsx` - Order modal component
2. ✅ `src/components/ProductCard.tsx` - Updated with Place Order button
3. ✅ `src/services/sellerApi.ts` - Has getSellerEmailByName() function
4. ✅ `src/services/productsApi.ts` - GViz JSON parsing fix applied

### Check Component Imports
In `ProductCard.tsx`, verify these imports exist:
```tsx
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { PlaceOrderModal } from './PlaceOrderModal';
```

## Step 3: Test the Complete Flow

### 1. Start Development Server
```bash
npm run dev
```
Server should be at `http://localhost:8081/` (or your configured port)

### 2. Navigate to Marketplace
- Click "Marketplace" in header
- Products should display (GViz parsing fix should work)

### 3. Test Place Order Button
1. Find a product with a seller
2. Click the green "Place Order" button
3. Modal should open with order form
4. Fill in:
   - Your Name: `Test Buyer`
   - Your Email: `test@example.com`
   - Quantity: `1`
5. Click "Place Order" button
6. Should show success message
7. Check emails:
   - ✅ Seller receives order notification
   - ✅ Admin (ermes1643@gmail.com) receives notification

### 4. Verify Data in Google Sheets
1. Open your Google Sheet
2. Check "Orders" sheet:
   - New row added with all order details
   - Columns: orderId, productId, sellerId, seller_email, buyer_name, buyer_email, quantity, total_price, createdAt

### 5. Check Email Logs
Apps Script → Executions tab:
- `placeOrder` should show no errors
- `sendOrderEmailToSeller` should execute successfully
- `sendOrderEmailToAdmin` should execute successfully

## Step 4: Production Deployment

### Before Going Live
- [ ] Test complete order flow end-to-end
- [ ] Verify both emails are received
- [ ] Check Google Sheets has all order data
- [ ] Test with real product and seller data
- [ ] Verify seller email lookup works for all sellers

### Build for Production
```bash
npm run build
```

### Deploy to Hosting
(Instructions depend on your hosting platform - Vercel, Netlify, etc.)

## Step 5: Troubleshooting

### Problem: "Unexpected token" GViz Error
**Solution:** Verify productsApi.ts has the updated regex:
```typescript
let jsonText = response;
if (response.includes('setResponse')) {
  jsonText = response.replace(/^.*setResponse\(/, '').replace(/\);?\s*$/, '');
} else if (response.includes('/*O_o*/')) {
  jsonText = response.replace(/^\/\*O_o\*\/\s*\n/, '').replace(/^\/\/.*\n/gm, '');
}
```

### Problem: "Seller not found" in Order
**Solution:** Verify in Google Sheets:
- Sellers sheet exists
- Column B has seller_name (exact match, case-sensitive)
- Column C has seller_email

Example Sellers sheet structure:
| Column A | Column B | Column C | ... |
|----------|----------|----------|-----|
| sellerId | seller_name | seller_email | ... |
| 1001 | Ahmed Shop | ahmed@example.com | ... |

### Problem: Emails Not Being Sent
**Solution 1:** Check MailApp permissions
- Google Apps Script requires permission to send emails
- You should see permission request on first run

**Solution 2:** Check email addresses
- Verify seller_email exists in Sellers sheet
- Verify ermes1643@gmail.com is correct
- Check for typos

**Solution 3:** Check Apps Script logs
- Open Apps Script editor
- Click "Executions" tab
- Look for function failures with error messages

### Problem: Modal Not Opening
**Solution:** Check browser console for errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any error messages
4. Verify PlaceOrderModal is properly imported in ProductCard

## Step 6: Verification Checklist

### Frontend Verification
- [ ] Products load in Marketplace (no GViz error)
- [ ] Each product shows both buttons (Contact Seller + Place Order)
- [ ] Place Order button opens modal
- [ ] Modal form validates inputs
- [ ] Modal shows success message on submission

### Backend Verification
- [ ] Order appears in Google Sheets Orders tab
- [ ] Seller email received notification
- [ ] Admin email received notification
- [ ] Email contains correct product, buyer, quantity information

### Data Verification
- [ ] Orders sheet has all correct columns
- [ ] Each order has unique orderId
- [ ] Timestamps are correct
- [ ] Seller email is populated correctly

## Step 7: Monitoring

### Daily Checks
- Monitor email deliverability (check spam folder if needed)
- Check Google Sheets for new orders
- Review Apps Script logs for errors

### User Support
- Guide customers to check spam folder for confirmation
- Provide contact info for order issues
- Set seller expectations for response times

## Rollback Plan

If something goes wrong:

### 1. Revert Apps Script
- Go back to previous deployment version
- Click "Manage deployments"
- Select previous version

### 2. Revert Frontend
```bash
git checkout src/components/ProductCard.tsx
git checkout src/components/PlaceOrderModal.tsx
git checkout src/services/sellerApi.ts
npm run dev
```

## Contact & Support

For issues:
1. Check browser console (F12) for errors
2. Check Apps Script Executions tab for function errors
3. Check email delivery in Google Account
4. Verify Google Sheets schema matches expected format

---

**Last Updated:** Now
**Status:** Ready for Deployment

