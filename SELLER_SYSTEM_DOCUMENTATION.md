# Seller Management System - Complete Implementation

## Overview

The system now has a full seller management platform with authentication, product management, and order notifications.

## Features Implemented

### 1. **Seller Authentication**
- **Random Seller ID Generation**: Sellers get a unique 8-character alphanumeric ID on registration
- **Login System**: Sellers can login with their ID to access the dashboard
- **Session Persistence**: Login state saved in localStorage

### 2. **Seller Dashboard** 
- **Product Overview**: See all your products at a glance
- **Sales Tracking**: View sales count for each product
- **Product Management**:
  - View all products with images and prices
  - Edit products
  - Delete products
- **Seller Profile**: Display seller info (name, email, WhatsApp, location)

### 3. **Product Management (CRUD)**
- **Create**: Add new products via submit form
- **Read**: Display products on dashboard and marketplace
- **Update**: Edit product details
- **Delete**: Remove products from inventory

### 4. **Order System**
- **Order Tracking**: All orders stored in Google Sheet
- **Email Notifications**: Sellers receive email when order is placed
- **Order Details**: Buyer info, quantity, total price

## File Structure

### New Components
- `src/components/SellerLogin.tsx` — Seller ID login form
- `src/components/SellerDashboard.tsx` — Dashboard displaying products and stats

### New Services
- `src/services/sellerApi.ts` — All seller API operations (register, login, CRUD)

### New Pages
- `src/pages/SellerPortal.tsx` — Main seller portal (handles login/setup/dashboard flow)

### Updated Files
- `src/App.tsx` — Added `/seller-portal` route
- `src/components/Header.tsx` — Added "Seller Portal" button

## Google Sheets Structure

The system now creates multiple sheets:

### 1. **Sellers Sheet**
```
sellerId | seller_name | seller_email | seller_whatsapp | seller_location | seller_image | createdAt
```

### 2. **Products Sheet**
```
id | sellerId | product_name | product_image_url | image_1 | image_2 | image_3 | 
seller_name | seller_image | seller_whatsapp | seller_email | seller_location | 
description | price | rating | category | location_google_maps_link | 
isBestSeller | salesCount | createdAt
```

### 3. **Orders Sheet**
```
orderId | productId | sellerId | seller_email | buyer_name | buyer_email | quantity | total_price | createdAt
```

## App Script Endpoints

### POST Operations
- `action=register_seller` — Register new seller (generates random ID)
- `action=add_product` — Add new product
- `action=place_order` — Place order and send email to seller

### PUT Operations
- `action=edit_product` — Update product details

### DELETE Operations
- `action=delete_product` — Remove product from inventory

### GET Operations
- `action=verify_seller&sellerId=...` — Check if seller exists (login)
- `action=get_seller_info&sellerId=...` — Fetch seller profile
- `action=get_seller_products&sellerId=...` — Get all seller's products

## User Flows

### For Sellers

#### First Time Registration
1. Click "Seller Portal" in header
2. Click "Register as Seller" link
3. Fill in seller info (name, email, WhatsApp, location, image)
4. System generates random Seller ID
5. Directed to dashboard

#### Subsequent Logins
1. Click "Seller Portal"
2. Enter Seller ID
3. Dashboard loads with their products

#### Adding Products
1. From dashboard, click "Add New Product"
2. Fill product form (name, images, description, price, etc.)
3. Product appears in dashboard and marketplace immediately

#### Managing Products
- **Edit**: Click edit button, modify details, save
- **Delete**: Click delete, confirm, product removed from inventory
- **View**: See all products with sales count

### For Customers (Placing Orders)
1. Browse products on marketplace
2. Click "Order" or "Buy Now"
3. Customer info captured
4. Order placed
5. **Seller receives email notification** with order details

## Email Notifications

When an order is placed:
- **To**: Seller's email (from registration)
- **Subject**: "New Order Received!"
- **Body**: 
  - Product name
  - Buyer name
  - Quantity
  - Total price
  - Request to follow up with buyer

Uses Google Apps Script's `MailApp.sendEmail()` - no external service needed.

## API Endpoints

All requests use `VITE_APPS_SCRIPT_URL` environment variable.

### Register Seller
```javascript
POST /apps_script_url
{
  action: "register_seller",
  seller_name: "...",
  seller_email: "...",
  seller_whatsapp: "...",
  seller_location: "...",
  seller_image: "..." // optional, base64
}
```
**Response**: `{ success: true, sellerId: "ABC12345" }`

### Get Seller Info
```
GET /apps_script_url?action=get_seller_info&sellerId=ABC12345
```
**Response**: Seller profile data

### Add Product
```javascript
POST /apps_script_url
{
  action: "add_product",
  sellerId: "ABC12345",
  product_name: "...",
  product_image_url: "...",
  // ... other product fields
}
```

### Edit Product
```javascript
PUT /apps_script_url
{
  action: "edit_product",
  sellerId: "ABC12345",
  productId: "...",
  // ... updated fields
}
```

### Delete Product
```javascript
DELETE /apps_script_url
{
  action: "delete_product",
  sellerId: "ABC12345",
  productId: "..."
}
```

### Place Order
```javascript
POST /apps_script_url
{
  action: "place_order",
  productId: "...",
  sellerId: "ABC12345",
  seller_email: "...",
  seller_name: "...",
  product_name: "...",
  buyer_name: "...",
  buyer_email: "...",
  quantity: 1,
  total_price: 500
}
```

## Next Steps

### To Implement Later
1. **Product Edit Page** — Full edit interface (currently just delete/view)
2. **Order History** — Show seller all orders placed on their products
3. **Payment Integration** — Stripe/PayPal for actual transactions
4. **Advanced Analytics** — Charts, sales trends, revenue
5. **Review System** — Customer ratings and reviews
6. **Inventory Tracking** — Stock management
7. **Seller Verification** — ID verification, approval workflow
8. **Custom Seller IDs** — Option to set custom username instead of random

## Testing

### Test Seller Registration
1. Go to `/seller-portal`
2. Click "Register"
3. Fill in seller info
4. Get random Seller ID
5. Check Google Sheet "Sellers" sheet

### Test Login
1. Go to `/seller-portal`
2. Enter Seller ID from above
3. Dashboard loads with your info

### Test Add Product
1. From dashboard, click "Add New Product"
2. Fill form, submit
3. Product appears on dashboard and marketplace

### Test Product Management
1. Click "Edit" or "Delete" on any product
2. Changes reflected immediately

### Test Email Notification
1. From marketplace, place order on seller's product
2. Check seller's email inbox
3. Should receive order notification

## Notes

- Seller IDs are randomly generated 8-character codes (can be customized later)
- Images can be uploaded as files (converted to base64) or pasted as URLs
- All data syncs with Google Sheets in real-time
- No backend needed - everything handled by Google Apps Script
- Email uses Gmail (connected to Google account that owns the sheet)

