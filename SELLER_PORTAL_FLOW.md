# Updated Seller Portal Flow

## Overview
The seller portal has been redesigned with a new registration workflow that sends email notifications to the admin when someone wants to register as a seller.

## New Seller Registration Flow

### 1. Registration Request Page
- When users click the small "Seller" button in the header, they first see a registration request modal
- The button is now small and subtle (text-xs, ghost variant)
- Users can choose "Not Now" or "Yes, Register Me"

### 2. Registration Notification
When user clicks "Yes, Register Me":
- An email is sent to: **ermes1643@gmail.com**
- Subject: "New Seller Registration Request"
- The user is then redirected to the registration form

### 3. Seller Information Form
Users fill in their complete profile:
- **Seller Name** (required)
- **Email** (required)
- **WhatsApp Number** (required)
- **Location** (required)
- **Seller Image** (optional)

### 4. Unique Seller ID Generation
Once registration is submitted:
- A unique 4-digit ID is generated (1000-9999)
- Format: Simple 4-digit numbers (e.g., "1234", "5678", "9999")
- IDs are stored in the Sellers sheet in Google Sheets
- The ID is guaranteed to be unique
- The user can copy the ID to clipboard

### 5. Seller ID Login
User is redirected to login page where they:
- Enter their 4-digit seller ID
- Click login
- Verified against the Sellers sheet

### 6. Seller Dashboard
After successful login:
- User can see their seller profile information
- View all their products in a grid
- Add new products
- Delete products
- Edit products (with button available)

## Key Components

### SellerRegisterRequest.tsx
- First page of seller portal
- Shows registration request modal
- Sends email notification to admin via Apps Script
- Routes to setup page on success

### SellerSetup.tsx (Updated)
- Collects seller information
- Calls `registerSeller()` API
- Generates 4-digit seller ID
- Displays the ID and copy button
- Auto-redirects to login page after 3 seconds

### SellerLogin.tsx
- Takes 4-digit seller ID
- Verifies against Sellers sheet
- Routes to dashboard on success

### SellerDashboard.tsx
- Shows seller profile
- Displays products in grid
- Edit and delete buttons per product
- Add new product button

## Database Schema

### Sellers Sheet (Google Sheets)
```
Column A: sellerId          (e.g., "1234")
Column B: seller_name       (string)
Column C: seller_email      (string)
Column D: seller_whatsapp   (string)
Column E: seller_location   (string)
Column F: seller_image      (base64 string)
Column G: createdAt         (ISO timestamp)
```

### Products Sheet
Products include both seller info and product details

### Orders Sheet
Orders are tracked when customers purchase

## Email Notifications

### Registration Request Email
- **To:** ermes1643@gmail.com
- **Trigger:** When user clicks "Yes, Register Me"
- **Function:** `notifyRegistrationRequest()` in Apps Script
- **Purpose:** Notify admin of new registration attempt

### Order Confirmation Email
- **To:** Seller's registered email
- **Trigger:** When order is placed
- **Function:** `sendOrderEmail()` in Apps Script
- **Purpose:** Notify seller of new order

## API Endpoints (Apps Script)

### Register Seller (POST)
```
Action: register_seller
Generates unique 4-digit ID
Returns: { success: boolean, message: string, sellerId: string }
```

### Verify Seller (GET)
```
URL: ?action=verify_seller&sellerId=1234
Returns seller info if exists
```

### Registration Notification (POST)
```
Action: notify_registration_request
Sends email to admin
Returns: { success: boolean, message: string }
```

## Updated Header Button

The "Seller Portal" button in the header:
- Desktop: Small text button (text-xs, ghost variant) with minimal styling
- Mobile: Small button in menu with minimal prominence
- Color: Default ghost button styling (subtle)
- Position: In navigation alongside Home and Marketplace

## Configuration

### .env Variables
```
VITE_SHEET_ID=1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

### Admin Email
- Configured: ermes1643@gmail.com
- To change: Update in Apps Script `notifyRegistrationRequest()` function

## Seller ID Format
- Type: 4-digit number
- Range: 1000 to 9999
- Examples: 1234, 5678, 9999, 1001
- User-friendly and easy to remember

## How to Deploy Apps Script Updates

1. Go to your Google Sheet
2. Click Extensions → Apps Script
3. Replace the code with content from APPS_SCRIPT_DEPLOYMENT.md
4. Save (Ctrl+S)
5. Click Deploy → Manage Deployments
6. Click "Create new deployment"
7. Use the same URL for your React .env file

## Testing Checklist

- [ ] Click "Seller" button in header
- [ ] See registration request modal
- [ ] Click "Yes, Register Me"
- [ ] Email sent to ermes1643@gmail.com
- [ ] Redirected to registration form
- [ ] Fill all required fields
- [ ] See 4-digit ID displayed
- [ ] Copy ID to clipboard
- [ ] Auto-redirected to login page
- [ ] Enter ID and login
- [ ] See seller dashboard with products
- [ ] Can add/edit/delete products

## Next Steps

1. Update Apps Script with new 4-digit ID generation function
2. Test the complete flow end-to-end
3. Verify email notifications are working
4. Deploy to production

