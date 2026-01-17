# Integration Checklist - Order Email System

## Phase 1: Apps Script Deployment ✓

### Step 1.1: Prepare the Code
- [ ] Open [APPS_SCRIPT_DEPLOYMENT.md](APPS_SCRIPT_DEPLOYMENT.md)
- [ ] Copy entire content to clipboard

### Step 1.2: Update Apps Script
- [ ] Open your Google Apps Script editor (attached to your Google Sheet)
- [ ] Replace all existing code with content from step 1.1
- [ ] Verify these functions exist:
  - [ ] `doGet()` - with get_seller_email_by_name handler
  - [ ] `doPost()` - for register_seller, add_product, place_order, etc.
  - [ ] `placeOrder()` - calls sendOrderEmailToSeller and sendOrderEmailToAdmin
  - [ ] `getSellerEmailByName()` - looks up seller email
  - [ ] `sendOrderEmailToSeller()` - sends to seller
  - [ ] `sendOrderEmailToAdmin()` - sends to admin

### Step 1.3: Deploy as Web App
- [ ] Click **Deploy** button
- [ ] Select **New deployment**
- [ ] Type: Select "Web app"
- [ ] Execute as: Select your Google account
- [ ] Who has access: Select "Anyone"
- [ ] Click **Deploy**
- [ ] Copy the new Deployment ID (you may need this)
- [ ] Copy the Execution URL

### Step 1.4: Grant Permissions
- [ ] Google will ask to grant permissions to Apps Script
- [ ] Click **Continue**
- [ ] Select your account
- [ ] Click **Allow** for all permissions (MailApp.sendEmail needed)

### Step 1.5: Verify Deployment
- [ ] Click on the Deployment ID to see details
- [ ] Note the Web app URL (may need to update frontend if changed)

---

## Phase 2: Frontend Verification ✓

### Step 2.1: Check Component Files
- [ ] Verify `src/components/PlaceOrderModal.tsx` exists (184 lines)
- [ ] Verify `src/components/ProductCard.tsx` has Place Order button
- [ ] Verify `src/services/sellerApi.ts` has getSellerEmailByName() function

### Step 2.2: Check Imports in ProductCard.tsx
```tsx
// Should have these imports:
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { PlaceOrderModal } from './PlaceOrderModal';
```

### Step 2.3: Check sellerApi.ts
```tsx
// Should export:
export const getSellerEmailByName = async (sellerName: string): Promise<string | null> => {
```

---

## Phase 3: Local Testing ✓

### Step 3.1: Start Dev Server
```bash
cd c:\Users\Admin\Downloads\foreignfinds-morocco-main\foreignfinds-morocco-main
npm run dev
```
- [ ] Server starts at http://localhost:8081/
- [ ] No errors in terminal

### Step 3.2: Test Marketplace Loading
- [ ] Open browser to http://localhost:8081/
- [ ] Click "Marketplace" in navigation
- [ ] Products should display (verify GViz parsing works)
- [ ] Each product card shows two buttons:
  - [ ] "Contact Seller" button (left)
  - [ ] "Place Order" button (green, right)

### Step 3.3: Test Place Order Modal
- [ ] Click "Place Order" button on any product
- [ ] Modal should open with form
- [ ] Modal shows:
  - [ ] Product name in description
  - [ ] Product price in description
  - [ ] Form with 3 fields: Name, Email, Quantity
  - [ ] Total price displayed (price × quantity)

### Step 3.4: Test Form Validation
- [ ] Try clicking "Place Order" without filling form
  - [ ] Error: "Please fill in all fields correctly"
- [ ] Fill only name and quantity, leave email empty
  - [ ] Error: "Please fill in all fields correctly"
- [ ] Fill with invalid email (e.g., "notanemail")
  - [ ] Should still allow submission (HTML5 validates, but form check may vary)

### Step 3.5: Test Quantity Calculation
- [ ] Type "1" in quantity field
  - [ ] Total price = product price
- [ ] Change to "2"
  - [ ] Total price = product price × 2
- [ ] Verify calculation is correct

### Step 3.6: Test Order Submission
- [ ] Fill form correctly:
  - [ ] Name: "Test Buyer"
  - [ ] Email: "test@example.com"
  - [ ] Quantity: "1"
- [ ] Click "Place Order" button
- [ ] Should see loading state (button disabled)
- [ ] After 2 seconds, should see success message:
  - [ ] Green checkmark icon
  - [ ] Text: "Order placed successfully! Emails have been sent to you and the seller."
- [ ] Modal should auto-close after 2 seconds

### Step 3.7: Check Browser Console
- [ ] Open DevTools (F12)
- [ ] Go to **Console** tab
- [ ] Look for any errors (should be none)
- [ ] Check for success logs

---

## Phase 4: Data Verification ✓

### Step 4.1: Check Google Sheets
- [ ] Open your Google Sheet
- [ ] Check for "Orders" sheet (should be created on first order)
- [ ] Verify order row was added with:
  - [ ] Unique orderId
  - [ ] Correct productId
  - [ ] Seller email (should be filled)
  - [ ] Buyer name: "Test Buyer"
  - [ ] Buyer email: "test@example.com"
  - [ ] Quantity: 1
  - [ ] Total price: (product price × 1)
  - [ ] createdAt: Current date/time

### Step 4.2: Verify Sellers Sheet
- [ ] Check "Sellers" sheet exists
- [ ] Verify columns:
  - [ ] Column A: sellerId (numeric)
  - [ ] Column B: seller_name (text)
  - [ ] Column C: seller_email (email address)
- [ ] At least one seller should have email populated

---

## Phase 5: Email Verification ✓

### Step 5.1: Check Seller Email
- [ ] Login to seller's email account
- [ ] Check Inbox for email with subject like: "New Order #ORD-..."
- [ ] Email should contain:
  - [ ] Order ID
  - [ ] Product name
  - [ ] Buyer name: "Test Buyer"
  - [ ] Buyer email: "test@example.com"
  - [ ] Quantity: 1
  - [ ] Total price in DH
  - [ ] Professional formatting

### Step 5.2: Check Admin Email
- [ ] Open ermes1643@gmail.com inbox
- [ ] Should have email with subject: "New Order Received #ORD-..."
- [ ] Email should contain:
  - [ ] Order ID (same as seller email)
  - [ ] Seller name
  - [ ] Product name
  - [ ] Buyer name: "Test Buyer"
  - [ ] Buyer email: "test@example.com"
  - [ ] Quantity: 1
  - [ ] Total price in DH
  - [ ] Note about monitoring

### Step 5.3: Check Spam Folder
- [ ] If emails not in Inbox, check Spam folder
- [ ] If found in Spam:
  - [ ] Mark as "Not Spam"
  - [ ] Emails should go to Inbox next time

---

## Phase 6: Error Scenarios Testing

### Step 6.1: Test Invalid Seller Name
- [ ] Manually edit a product in Google Sheets
- [ ] Change seller_name to non-existent name (e.g., "NonExistent123")
- [ ] Try to place order on that product
- [ ] Should either:
  - [ ] Use empty seller_email (safe fallback)
  - [ ] Show friendly error message

### Step 6.2: Test Network Error
- [ ] Disconnect internet momentarily
- [ ] Try to place order
- [ ] Should show error message after timeout
- [ ] Error should be user-friendly

### Step 6.3: Test Duplicate Submission
- [ ] Fill form and submit
- [ ] Immediately click "Place Order" again
- [ ] Should only create one order (button should be disabled during submission)

---

## Phase 7: Production Deployment

### Step 7.1: Build Project
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] Output folder created (typically `dist/`)

### Step 7.2: Deploy to Hosting
- [ ] Deploy `dist/` folder to your hosting service
  - [ ] Vercel: `vercel deploy`
  - [ ] Netlify: `netlify deploy`
  - [ ] Manual: Upload files via FTP/SSH
- [ ] Test live site:
  - [ ] Navigate to marketplace
  - [ ] Test Place Order button
  - [ ] Verify emails send

### Step 7.3: Update Environment Variables (if needed)
- [ ] Verify APPS_SCRIPT_URL is correct in environment
- [ ] Verify other config is correct for production

---

## Phase 8: Post-Deployment Monitoring

### Daily Tasks
- [ ] Check for new orders in Google Sheets
- [ ] Verify emails are being sent (check Admin inbox)
- [ ] Monitor browser console for errors (in production)
- [ ] Review Apps Script logs for failures

### Weekly Tasks
- [ ] Review order statistics
- [ ] Check for any pattern of failures
- [ ] Verify seller engagement (do they respond to orders?)
- [ ] Collect user feedback

### Issues to Watch For
- [ ] Emails going to spam
- [ ] High order abandonment (form issues)
- [ ] Seller not responding to orders
- [ ] Orders not saving in Google Sheets

---

## Rollback Plan (If Issues Arise)

### Option 1: Revert Apps Script
```
Apps Script → Manage deployments → Select previous version
```

### Option 2: Revert Frontend Files
```bash
git checkout src/components/ProductCard.tsx
git checkout src/components/PlaceOrderModal.tsx
git checkout src/services/sellerApi.ts
npm run build
# Redeploy
```

---

## Success Criteria

✅ **Order Feature is Successfully Deployed When:**
- [ ] Products load in marketplace (no GViz errors)
- [ ] Place Order button visible on all products
- [ ] Modal opens and form displays correctly
- [ ] Order can be submitted without errors
- [ ] Order appears in Google Sheets Orders tab
- [ ] Seller receives order notification email
- [ ] Admin (ermes1643@gmail.com) receives notification email
- [ ] Emails contain all required information
- [ ] No errors in browser console
- [ ] No errors in Apps Script logs
- [ ] Users can place multiple orders
- [ ] Each order gets unique ID

---

## Support & Troubleshooting

**If something goes wrong:**

1. **Check Browser Console** (F12 → Console tab)
   - Look for error messages
   - Search for "getSellerEmailByName" or "placeOrder" errors

2. **Check Apps Script Logs** (Apps Script → Executions)
   - Find failed executions
   - Read error messages

3. **Check Email** (Gmail admin account)
   - Verify ermes1643@gmail.com is receiving emails
   - Check spam folder
   - Check sender settings in Apps Script

4. **Check Google Sheets**
   - Verify Orders sheet exists
   - Verify Sellers sheet has correct seller data
   - Verify seller_email column (C) is populated

5. **Refer to Documentation**
   - [DEPLOYMENT_GUIDE_ORDER_SYSTEM.md](DEPLOYMENT_GUIDE_ORDER_SYSTEM.md)
   - [ORDER_EMAIL_SYSTEM.md](ORDER_EMAIL_SYSTEM.md)
   - [CODE_CHANGES_SUMMARY.md](CODE_CHANGES_SUMMARY.md)

---

## Next Steps After Deployment

Once everything is working:

1. **Monitor** - Track orders for issues
2. **Optimize** - Improve based on user feedback
3. **Enhance** - Consider payment gateway integration
4. **Expand** - Add order tracking/history features

---

**Checklist Status:** Ready for Full Deployment ✅

**Last Updated:** Today

**Estimated Time to Deploy:** 30-45 minutes

