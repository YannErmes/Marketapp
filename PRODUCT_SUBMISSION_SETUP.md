# ForeignFinds Morocco - Product Submission & Data Integration

This guide explains how to set up the product submission form and configure Google Sheets as your data source.

## Overview

The app has two main data flows:

1. **Reading Products** — The website displays products fetched directly from your Google Sheet
2. **Submitting Products** — Sellers can fill out a form to add new products to the sheet

## Part 1: Configure Google Sheets as Data Source

### Step 1: Make Your Sheet Public

1. Open your Google Sheet: [https://docs.google.com/spreadsheets/d/1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg/edit](https://docs.google.com/spreadsheets/d/1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg/edit)
2. Click **Share** (top right)
3. Select "Anyone with the link" or "Public"
4. Copy the share link

### Step 2: Set Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```env
# The spreadsheet ID extracted from your Google Sheet URL
VITE_SHEET_ID=1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg

# Your deployed Apps Script endpoint (see Part 2 for setup)
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent
```

### Step 3: Verify Sheet Structure

Ensure your Google Sheet has the following columns as headers in the first row:

```
id, product_name, product_image_url, image_1, image_2, image_3, seller_name, seller_image, seller_whatsapp, seller_email, seller_location, description, price, rating, category, location_google_maps_link, isBestSeller, salesCount, createdAt
```

The app will automatically fetch and parse data from these columns.

### Step 4: Run the App

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/marketplace` — products should load from your sheet!

---

## Part 2: Set Up Product Submission (Apps Script)

### Step 1: Open Apps Script Editor

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. A new tab opens with the editor

### Step 2: Deploy the Apps Script

1. Delete any default content
2. Copy all code from [APPS_SCRIPT_DEPLOYMENT.md](./APPS_SCRIPT_DEPLOYMENT.md)
3. Paste into the Apps Script editor
4. Click **Save** (Ctrl+S)
5. Click **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: Your Google account
   - Who has access: **Anyone**
6. Click **Deploy**
7. **Copy the deployment URL** (looks like: `https://script.google.com/macros/d/AKfycbz.../usercontent`)

### Step 3: Add to Environment

Update your `.env` file with the deployment URL:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/AKfycbz.../usercontent
```

### Step 4: Test the Form

1. Navigate to `/submit-product` in your app
2. **First visit**: Fill in seller information (name, email, WhatsApp, location, image)
3. Click **Complete Registration**
4. **Seller info is saved** in your browser's local storage
5. **Next visit**: The form shows your seller info and only asks for product details
6. Fill in product info and click **Add Product**
7. Check your Google Sheet — new row should appear within seconds!

---

## Form Flow

### First-Time Seller Setup
- Seller name
- Email
- WhatsApp number
- Location
- Seller image (optional)

**Data is stored locally** — no need to re-enter on next visit

### Add New Product (All Subsequent Visits)
The form auto-fills seller info and asks for:

- Product name
- Main product image (URL or upload)
- Additional images 1, 2, 3 (optional)
- Description
- Price
- Rating (0-5)
- Category
- Google Maps link (optional)
- Best Seller checkbox
- Sales count

---

## Sheet Structure Reference

Your Google Sheet should match this structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | String | Unique product ID (auto-generated) |
| `product_name` | String | Product title |
| `product_image_url` | String | Main product image URL or base64 |
| `image_1, image_2, image_3` | String | Additional product images |
| `seller_name` | String | Seller's business name |
| `seller_image` | String | Seller's profile image |
| `seller_whatsapp` | String | Seller's WhatsApp number |
| `seller_email` | String | Seller's email |
| `seller_location` | String | Seller's city/region |
| `description` | String | Product description |
| `price` | Number | Product price in DH |
| `rating` | Number | Product rating (0-5) |
| `category` | String | Product category |
| `location_google_maps_link` | String | Google Maps link to seller location |
| `isBestSeller` | Boolean | TRUE/FALSE |
| `salesCount` | Number | Number of sales |
| `createdAt` | String | ISO timestamp when added |

---

## Troubleshooting

### Products not loading on `/marketplace`
- ✅ Check that `VITE_SHEET_ID` is set in `.env`
- ✅ Verify your Google Sheet is public
- ✅ Ensure the first row contains headers exactly as specified
- ✅ Check browser console for errors

### Form submission fails
- ✅ Check that `VITE_APPS_SCRIPT_URL` is set in `.env`
- ✅ Verify the Apps Script is deployed with "Anyone" access
- ✅ Check the Apps Script execution logs for errors
- ✅ Make sure your sheet is editable by the Apps Script

### Changes to sheet don't appear on site
- ✅ Products are cached for 5 minutes — wait or hard refresh
- ✅ Ensure new products have all required columns

---

## File Structure

```
src/
├── services/
│   ├── productsApi.ts          # Fetch products from Google Sheet
│   └── addProductApi.ts        # Submit products to Apps Script
├── components/
│   ├── SellerSetup.tsx         # First-time seller registration form
│   └── AddProduct.tsx          # Product submission form
├── pages/
│   └── SubmitProduct.tsx       # Form page with routing logic
└── App.tsx                     # Added /submit-product route
```

---

## API Reference

### Fetching Products (Reading)
- **Source**: Google Sheets GViz JSON API
- **Endpoint**: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json`
- **Method**: GET (automatic via browser)
- **Cache**: 5 minutes

### Submitting Products (Writing)
- **Source**: Apps Script deployment
- **Endpoint**: Your deployed Apps Script URL
- **Method**: POST
- **Payload**: JSON with all product + seller fields
- **Response**: `{ success: true, message: "...", id: "..." }`

---

## Next Steps

1. ✅ Make sheet public
2. ✅ Set `VITE_SHEET_ID` in `.env`
3. ✅ Deploy Apps Script
4. ✅ Set `VITE_APPS_SCRIPT_URL` in `.env`
5. ✅ Test on `/submit-product`
6. ✅ Verify data appears in Google Sheet

You're all set! 🎉

