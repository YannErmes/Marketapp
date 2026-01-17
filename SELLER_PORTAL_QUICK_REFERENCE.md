# Seller Portal - Quick Reference Guide

## User Journey Map

### New Seller Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SELLER PORTAL FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. HOME PAGE
   └─ Click small "Seller" button in header →

2. REGISTRATION REQUEST MODAL
   ┌─────────────────────────────────────────┐
   │ "Become a Seller"                       │
   │                                         │
   │ Join our marketplace and start          │
   │ selling your products                   │
   │                                         │
   │ [Not Now]  [Yes, Register Me]          │
   └─────────────────────────────────────────┘
   
   Click "Yes, Register Me" →
   ✉️  Email sent to ermes1643@gmail.com →

3. SELLER INFORMATION FORM
   ┌─────────────────────────────────────────┐
   │ Seller Registration                     │
   │                                         │
   │ Seller Name *     [________________]    │
   │ Email *           [________________]    │
   │ WhatsApp *        [________________]    │
   │ Location *        [________________]    │
   │ Seller Image      [Choose File]         │
   │                                         │
   │  [Complete Registration]                │
   └─────────────────────────────────────────┘
   
   Submit →

4. ID DISPLAY SCREEN
   ┌─────────────────────────────────────────┐
   │ ✓ Seller profile created!               │
   │                                         │
   │ Your Seller ID                          │
   │ Save this securely. You'll need it      │
   │ to login.                               │
   │                                         │
   │ ┌──────────────────────┬─────┐          │
   │ │  1234                │ 📋  │          │
   │ └──────────────────────┴─────┘          │
   │ Copied to clipboard! (2s)               │
   │                                         │
   │ Next step: Redirecting to login...      │
   └─────────────────────────────────────────┘
   
   Auto-redirect after 3 seconds →

5. SELLER LOGIN
   ┌─────────────────────────────────────────┐
   │ Seller Login                            │
   │                                         │
   │ Enter your Seller ID:                   │
   │ [________________]                      │
   │                                         │
   │  [Login]   [Back]                       │
   └─────────────────────────────────────────┘
   
   Enter ID "1234" and login →

6. SELLER DASHBOARD
   ┌─────────────────────────────────────────┐
   │ Dashboard - John Doe                    │
   │ john@example.com | +212... | Marrakech │
   │                                         │
   │ [Add New Product]                       │
   │                                         │
   │ My Products (X)                         │
   │                                         │
   │ ┌─────┐  ┌─────┐  ┌─────┐               │
   │ │Prod │  │Prod │  │Prod │  ...         │
   │ │$XX  │  │$XX  │  │$XX  │               │
   │ │[Edit]  │[Edit]  │[Edit]               │
   │ │[Del]   │[Del]   │[Del]                │
   │ └─────┘  └─────┘  └─────┘               │
   │                                         │
   │ [Logout]                                │
   └─────────────────────────────────────────┘
```

## Key Information

### Seller ID Details
- **Format:** 4-digit number (e.g., 1234)
- **Range:** 1000-9999
- **Usage:** Login credential
- **Security:** No password needed
- **How to get:** Receive after registration

### Email Notifications
1. **Registration Request Email**
   - **Sent to:** Admin (ermes1643@gmail.com)
   - **When:** User clicks "Yes, Register Me"
   - **Purpose:** Alert admin of new registration

2. **Order Notification Email**
   - **Sent to:** Seller's email
   - **When:** Customer orders product
   - **Purpose:** Notify of new order

## Header Button

### Location & Styling
```
Desktop:  Right side, small text button (text-xs)
Mobile:   In hamburger menu, small button
Variant:  Ghost (subtle, not prominent)
Label:    "Seller" (desktop) / "Seller Portal" (mobile)
```

## Important Credentials

### For Admin
- **Email:** ermes1643@gmail.com (receives registration notifications)
- **Role:** Monitor new seller registrations
- **Action:** Can view registrations in "Sellers" sheet

### For Sellers
- **ID:** 4-digit number (provided after registration)
- **Storage:** Secure copy of ID
- **Usage:** Login credential
- **Reset:** Not self-service, contact admin

## Google Sheets Structure

### Sellers Sheet
```
Column │ Field             │ Type        │ Example
────────────────────────────────────────────────────────
A      │ sellerId          │ 4-digit #   │ 1234
B      │ seller_name       │ Text        │ John Doe
C      │ seller_email      │ Email       │ john@ex.com
D      │ seller_whatsapp   │ Phone       │ +212612345678
E      │ seller_location   │ Text        │ Marrakech
F      │ seller_image      │ Base64      │ [image data]
G      │ createdAt         │ Timestamp   │ 2024-01-17T...
```

### Products Sheet
Linked by `sellerId` field for multi-seller support

### Orders Sheet
Tracks all orders with seller notification

## Environment Configuration

### Required .env Variables
```
VITE_SHEET_ID=1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKf.../exec
```

### To Update Apps Script URL
1. Go to Google Sheet
2. Extensions → Apps Script
3. Click Deploy → Manage Deployments
4. Copy "Web app" URL
5. Update `.env` file

## Common Tasks

### For Users
**Want to register?**
1. Click "Seller" in header
2. Click "Yes, Register Me"
3. Check email for notification (admin receives)
4. Fill registration form
5. Copy your ID
6. Login with ID
7. Start adding products

**Forgot your ID?**
1. Contact admin: ermes1643@gmail.com
2. Provide your registration details
3. Admin will provide your ID

### For Admin
**Monitor registrations?**
1. Check email notifications
2. View "Sellers" sheet in Google Sheet
3. See all registered sellers with details
4. Contact sellers if needed

**Edit seller info?**
1. Open "Sellers" sheet
2. Find seller by ID
3. Edit relevant cells
4. Changes apply immediately

## Testing Flow (QA)

### Quick Test
```
1. npm run dev
2. Navigate to http://localhost:8081/
3. Click "Seller" button (small, right side)
4. Click "Yes, Register Me"
5. Fill form with test data
6. Copy ID displayed
7. Use ID to login
8. Verify dashboard shows
```

### Full Test Scenario
```
1. Register new seller with unique email
2. Verify registration email sent
3. Verify ID generated (4 digits)
4. Login with provided ID
5. Add test product
6. Verify product appears in dashboard
7. Delete product
8. Verify deletion in dashboard
9. Logout and re-login
10. Verify session persistence
```

## Troubleshooting Quick Links

**Button not visible?**
- ✓ Check header.tsx (should be in nav)
- ✓ Verify not hidden by CSS
- ✓ Check variant is "ghost"

**Registration fails?**
- ✓ Verify all fields filled
- ✓ Check Apps Script URL in .env
- ✓ View Apps Script execution logs
- ✓ Ensure Google Sheet is accessible

**Email not received?**
- ✓ Check spam folder
- ✓ Verify email address (ermes1643@gmail.com)
- ✓ Check Apps Script logs for errors
- ✓ Ensure Apps Script has email permission

**Can't login?**
- ✓ Verify ID is 4 digits
- ✓ Check ID exists in Sellers sheet
- ✓ Ensure no typos in ID entry
- ✓ Try different browser (cache issue)

**ID not copied?**
- ✓ Check browser permissions
- ✓ Try clicking copy button again
- ✓ Use manual copy (Ctrl+C) as fallback

## Quick Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
```
1. Update Apps Script code
2. Click Deploy → Create new deployment
3. Copy URL to .env
4. Run: npm run build
5. Deploy static files
```

## Related Documentation

- `SELLER_PORTAL_UPDATE.md` - Detailed changes
- `APPS_SCRIPT_UPDATES.md` - Backend changes
- `APPS_SCRIPT_DEPLOYMENT.md` - Full Apps Script code
- `SELLER_PORTAL_FLOW.md` - Complete flow documentation
- `SELLER_SYSTEM_DOCUMENTATION.md` - System overview

