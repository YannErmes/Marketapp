# Quick Start: Product Submission & Google Sheets Integration

## TL;DR — 5 Steps to Get Running

### 1. Set Sheet ID in `.env`
```env
VITE_SHEET_ID=1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg
```
✅ Products will now load from your Google Sheet on the marketplace page

---

### 2. Deploy Apps Script

1. Open your sheet → **Extensions** → **Apps Script**
2. Paste code from `APPS_SCRIPT_DEPLOYMENT.md`
3. **Save** then **Deploy** as Web app
4. Copy deployment URL

---

### 3. Add Apps Script URL to `.env`
```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_ID/usercontent
```

---

### 4. Start the app
```bash
npm run dev
```

---

### 5. Visit `/submit-product`

- **First time**: Register seller info (name, email, WhatsApp, location)
- **Saved locally** in browser
- **Next time**: Just add products
- Products appear in your Google Sheet instantly!

---

## What You Get

✅ **Read from Sheet** — Products load from Google Sheets on marketplace  
✅ **Write to Sheet** — Sellers submit forms and data goes to your sheet  
✅ **No Server Needed** — Everything is serverless using Google's infrastructure  
✅ **Two-Step Form** — Seller setup once, then quickly add products  

---

## Form Access

- **Marketplace**: `/marketplace` — displays all products
- **Submit Product**: `/submit-product` — form for sellers to add products

---

## Seller Data Flow

```
First Visit:
┌─────────────────┐
│  SellerSetup    │  ← Fill in seller info (name, email, etc)
└────────┬────────┘
         │
         ↓
  [Saved in localStorage]


Subsequent Visits:
┌─────────────────┐
│  AddProduct     │  ← Auto-filled seller info, add products
└────────┬────────┘
         │
         ↓
   [POST to Apps Script]
         │
         ↓
   [Appends row to Google Sheet]
```

---

## Files Added

```
✅ src/services/addProductApi.ts        — Submit products to Apps Script
✅ src/components/SellerSetup.tsx       — First-time seller form
✅ src/components/AddProduct.tsx        — Product submission form
✅ src/pages/SubmitProduct.tsx          — Main form page
✅ APPS_SCRIPT_DEPLOYMENT.md            — Apps Script code + instructions
✅ PRODUCT_SUBMISSION_SETUP.md          — Full setup guide
✅ .env.example                         — Environment variables reference
✅ Updated App.tsx                      — Added /submit-product route
✅ Updated src/services/productsApi.ts  — Added Google Sheets GViz fetching
```

---

## Environment Variables

**VITE_SHEET_ID**  
Your Google Sheet ID (extract from the URL)

**VITE_APPS_SCRIPT_URL**  
Your deployed Apps Script endpoint (from deployment step)

---

## Need Help?

See `PRODUCT_SUBMISSION_SETUP.md` for:
- Detailed setup instructions
- Troubleshooting
- Sheet structure reference
- API documentation
- File structure overview

