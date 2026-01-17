# Seller Portal Architecture & Flow Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FOREIGNFINDS MOROCCO - SELLER SYSTEM              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND (React/TypeScript)                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Header.tsx                    SellerPortal.tsx                     │
│  ┌──────────────────┐          ┌─────────────────────────┐          │
│  │ [Seller] button  │─────────▶│ request → setup →       │          │
│  │ (small, ghost)   │          │ login → dashboard       │          │
│  └──────────────────┘          └─────────────────────────┘          │
│                                         │                            │
│                                         ├─▶ SellerRegisterRequest    │
│                                         ├─▶ SellerSetup              │
│                                         ├─▶ SellerLogin              │
│                                         └─▶ SellerDashboard          │
│                                                                      │
│  Services Layer                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ sellerApi.ts                                                 │   │
│  │ - registerSeller()    [POST to Apps Script]                 │   │
│  │ - verifySeller()      [GET from Apps Script]                │   │
│  │ - getSellerInfo()     [GET from Apps Script]                │   │
│  │ - getSellerProducts() [GET from Apps Script]                │   │
│  │ - submitProductToSheet()  [POST to Apps Script]             │   │
│  │ - placeOrder()        [POST to Apps Script]                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Local Storage                                                      │
│  - sellerId (session persistence)                                  │
│  - sellerInfo (cached seller data)                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
         ▲                                      │
         │                                      ▼
         └──────────────────────────────────────┤
                                                │
                                      Apps Script Gateway
                                      (CORS-safe via text/plain)
                                                │
         ┌──────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ BACKEND (Google Apps Script)                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  HTTP Handlers                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ doPost(e)  - Handles POST requests                          │   │
│  │ doPut(e)   - Handles PUT requests                           │   │
│  │ doDelete(e)- Handles DELETE requests                        │   │
│  │ doGet(e)   - Handles GET requests                           │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Actions                                                            │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ register_seller                 [POST]                       │ │
│  │ notifyRegistrationRequest       [POST]                       │ │
│  │ add_product                     [POST]                       │ │
│  │ edit_product                    [PUT]                        │ │
│  │ delete_product                  [DELETE]                     │ │
│  │ place_order                     [POST]                       │ │
│  │ verify_seller                   [GET]                        │ │
│  │ get_seller_info                 [GET]                        │ │
│  │ get_seller_products             [GET]                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Business Logic                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ registerSeller()           - Generate 4-digit ID             │ │
│  │ notifyRegistrationRequest()- Send email to ermes1634@...     │ │
│  │ verifySeller()             - Check if seller exists          │ │
│  │ getSellerInfo()            - Retrieve seller data            │ │
│  │ addProduct()               - Add product to sheet            │ │
│  │ editProduct()              - Update product                  │ │
│  │ deleteProduct()            - Remove product                  │ │
│  │ getSellerProducts()        - Fetch seller's products         │ │
│  │ placeOrder()               - Create order                    │ │
│  │ sendOrderEmail()           - Notify seller of order          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Utilities                                                          │
│  └─ createResponse() - Standardized response format                │
│  └─ MailApp.sendEmail() - Email notifications                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
         │                                                   │
         │                                      Email (MailApp)
         │                                      Sent to sellers
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ DATABASE (Google Sheets)                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Sellers Sheet                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ sellerId│name       │email      │phone       │location│image│ │
│  │ 1234    │John Doe   │john@...   │+2126123456 │Marr...│[...]│ │
│  │ 5678    │Jane Smith │jane@...   │+2126789012 │Fez    │[...]│ │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Products Sheet                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ id │sellerId│name    │image │price │seller_name │...       │  │
│  │... │1234    │Product1│[...] │99DH  │John Doe    │...       │  │
│  │... │1234    │Product2│[...] │149DH │John Doe    │...       │  │
│  │... │5678    │Product3│[...] │199DH │Jane Smith  │...       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Orders Sheet                                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │orderId│productId│sellerId│seller_email│buyer_name│qty│price │ │
│  │...    │...      │1234    │john@...    │Customer  │1  │99    │ │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Sheet ID: 1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Registration Flow Sequence Diagram

```
SELLER          BROWSER         APPS SCRIPT         GOOGLE SHEET        MAIL SERVER
  │               │                  │                   │                 │
  │ Click Seller  │                  │                   │                 │
  │ button        │                  │                   │                 │
  ├──────────────▶│                  │                   │                 │
  │               │ Show modal       │                   │                 │
  │               │◀─────────────────│                   │                 │
  │               │                  │                   │                 │
  │ Click "Yes"   │                  │                   │                 │
  │               │                  │                   │                 │
  ├──────────────▶│ POST             │                   │                 │
  │               │ notify_request   │                   │                 │
  │               ├─────────────────▶│ Send email        │                 │
  │               │                  ├──────────────────▶│ Deliver to      │
  │               │                  │                   │ ermes1634@...   │
  │               │                  │                   │                 │
  │ Fill form     │ Return success   │                   │                 │
  │ (Name, Email, │◀────────────────┤                   │                 │
  │  Phone,       │ Show form        │                   │                 │
  │  Location,    │                  │                   │                 │
  │  Image)       │                  │                   │                 │
  │               │                  │                   │                 │
  │ Submit form   │                  │                   │                 │
  ├──────────────▶│ POST             │                   │                 │
  │               │ register_seller  │                   │                 │
  │               ├─────────────────▶│ Generate ID       │                 │
  │               │                  │ (e.g., 1234)      │                 │
  │               │                  │ Create row        │                 │
  │               │                  ├──────────────────▶│ Add seller row  │
  │               │                  │ Return ID         │                 │
  │               │◀────────────────┤ Return success    │                 │
  │               │ Display ID       │                   │                 │
  │ Copy ID       │ "1234"           │                   │                 │
  ├──────────────▶│ Copy button      │                   │                 │
  │               │                  │                   │                 │
  │ Wait 3 sec    │ Auto-redirect    │                   │                 │
  │               │ to login page    │                   │                 │
  │               │                  │                   │                 │
  │ Enter ID      │                  │                   │                 │
  │ Login         │ POST             │                   │                 │
  ├──────────────▶│ verify_seller    │                   │                 │
  │               ├─────────────────▶│ Check sheet       │                 │
  │               │                  ├──────────────────▶│ Query ID        │
  │               │                  │◀──────────────────┤ Return seller   │
  │               │ Return success   │                   │                 │
  │               │◀────────────────┤                   │                 │
  │ Dashboard     │ Load dashboard   │                   │                 │
  │ Loads         │                  │                   │                 │
  │               │ GET              │                   │                 │
  │               │ get_seller_      │                   │                 │
  │               │ products         │                   │                 │
  │               ├─────────────────▶│ Fetch products    │                 │
  │               │                  ├──────────────────▶│ Query products  │
  │               │                  │◀──────────────────┤ Return list     │
  │               │ Return products  │                   │                 │
  │               │◀────────────────┤                   │                 │
  │ View profile  │ Display products │                   │                 │
  │ Manage        │ & dashboard      │                   │                 │
  │ products      │                  │                   │                 │
  │               │                  │                   │                 │
  
```

---

## Component Hierarchy Diagram

```
App.tsx
│
├─ Header.tsx
│  └─ "Seller" Button (small, ghost variant)
│     └─ navigates to /seller-portal
│
├─ Routes
│  ├─ Route: /
│  │  └─ Home.tsx
│  │
│  ├─ Route: /marketplace
│  │  └─ Marketplace.tsx
│  │
│  ├─ Route: /seller-portal
│  │  └─ SellerPortal.tsx
│     │  ├─ SellerRegisterRequest (step: "request")
│     │  │  ├─ Modal with Yes/No buttons
│     │  │  ├─ Calls: notifyRegistrationRequest()
│     │  │  └─ Routes to: setup
│     │  │
│     │  ├─ SellerSetup (step: "setup")
│     │  │  ├─ Registration form
│     │  │  ├─ Fields: name, email, phone, location, image
│     │  │  ├─ Calls: registerSeller()
│     │  │  ├─ Shows: Generated 4-digit ID
│     │  │  ├─ Copy button
│     │  │  └─ Routes to: login (auto-redirect)
│     │  │
│     │  ├─ SellerLogin (step: "login")
│     │  │  ├─ ID input field
│     │  │  ├─ Calls: verifySeller()
│     │  │  └─ Routes to: dashboard
│     │  │
│     │  └─ SellerDashboard (step: "dashboard")
│     │     ├─ Profile display
│     │     ├─ Product grid
│     │     │  ├─ Add product button
│     │     │  ├─ Product cards with:
│     │     │  │  ├─ Edit button
│     │     │  │  └─ Delete button
│     │     │  └─ Calls: submitProductToSheet(), deleteProduct()
│     │     └─ Logout button
│  │
│  └─ Other routes...
│
├─ Services
│  └─ sellerApi.ts
│     ├─ registerSeller(data)
│     ├─ verifySeller(sellerId)
│     ├─ getSellerInfo(sellerId)
│     ├─ getSellerProducts(sellerId)
│     ├─ submitProductToSheet(productData)
│     ├─ editProduct(productId, sellerId, data)
│     ├─ deleteProduct(productId, sellerId)
│     ├─ placeOrder(orderData)
│     └─ Session management functions
│
└─ Hooks & Utils
   ├─ useProducts() - Product fetching
   ├─ localStorage - Session storage
   └─ lib/utils.ts - Utility functions
```

---

## State Flow Diagram

```
PORTAL STEP STATE: "request" | "login" | "setup" | "dashboard"

Initial: "request"

"request"
  │
  │ User clicks "Yes, Register Me"
  │ ↓
  └─▶ "setup"
       │
       │ Email sent to ermes1643@gmail.com
       │ Form displayed
       │
       │ User fills form and submits
       │ API creates seller, generates ID
       │ ID displayed with copy button
       │ ↓
       └─▶ "login" (auto-redirect after 3 sec)
            │
            │ Form displayed
            │ User enters 4-digit ID
            │ User clicks Login
            │ ↓
            └─▶ "dashboard" (on verify success)
                 │
                 │ Dashboard displayed
                 │ Can add/edit/delete products
                 │ Can logout
                 │ ↓
                 └─▶ "request" (on logout)

Alternative path (returning user):
Initial load
  │
  │ Check localStorage for sellerId
  │ ↓
  └─▶ If exists: Go directly to "dashboard"
     │
     └─▶ If not exists: Show "request" step
```

---

## Data Flow Diagram

```
SELLER INPUT
     │
     ├─▶ Registration Request
     │   ├─ Click "Yes"
     │   └─▶ App calls: notifyRegistrationRequest()
     │       ├─ Posts to Apps Script
     │       └─ MailApp sends email to ermes1643@gmail.com
     │
     ├─▶ Registration Form
     │   ├─ Name, Email, Phone, Location, Image
     │   ├─ Validation (all required except image)
     │   └─▶ App calls: registerSeller(data)
     │       ├─ Posts to Apps Script
     │       ├─ Apps Script:
     │       │  ├─ Generates unique 4-digit ID
     │       │  ├─ Writes to Google Sheet (Sellers sheet)
     │       │  └─ Returns ID
     │       ├─ Frontend displays ID
     │       └─ localStorage stores sellerId
     │
     └─▶ Seller Login
         ├─ Enter 4-digit ID
         └─▶ App calls: verifySeller(sellerId)
             ├─ Gets from Apps Script
             ├─ Apps Script queries Sellers sheet
             ├─ Returns seller info if exists
             ├─ localStorage stores sellerId + info
             └─ Navigate to dashboard

PRODUCT MANAGEMENT
     │
     ├─▶ Add Product
     │   ├─ Form submission
     │   └─▶ App calls: submitProductToSheet(data)
     │       ├─ Posts to Apps Script
     │       ├─ Apps Script writes to Products sheet
     │       └─ Seller ID linked to product
     │
     ├─▶ Edit Product
     │   ├─ Form submission
     │   └─▶ App calls: editProduct(id, sellerId, data)
     │       ├─ Puts to Apps Script
     │       ├─ Apps Script updates Products sheet
     │       └─ Only seller can edit their products
     │
     └─▶ Delete Product
         ├─ Delete button click
         └─▶ App calls: deleteProduct(id, sellerId)
             ├─ Deletes from Apps Script
             ├─ Apps Script deletes from Products sheet
             └─ Only seller can delete their products

ORDER PROCESSING
     │
     └─▶ Customer Orders
         ├─ Customer clicks "Buy"
         └─▶ App calls: placeOrder(orderData)
             ├─ Posts to Apps Script
             ├─ Apps Script:
             │  ├─ Creates order in Orders sheet
             │  └─ Sends email to seller (MailApp)
             └─ Seller receives notification
```

---

## ID Generation Logic

```
registerSeller(data) {
  
  Step 1: Get Sellers sheet (create if not exists)
  ├─ Check if "Sellers" sheet exists
  └─ If not: Create with headers
  
  Step 2: Load existing IDs
  ├─ Read all rows in Sellers sheet
  ├─ Extract sellerId from column A
  └─ Store in Set for quick lookup
  
  Step 3: Generate unique ID
  ├─ Loop until unique ID found:
  │  ├─ Generate random number 1000-9999
  │  ├─ Check if exists in Set
  │  └─ If not: Use as sellerId, exit loop
  └─ Example results: 1234, 5678, 9999
  
  Step 4: Create new seller row
  ├─ Append row to sheet with:
  │  ├─ sellerId (generated)
  │  ├─ seller_name
  │  ├─ seller_email
  │  ├─ seller_whatsapp
  │  ├─ seller_location
  │  ├─ seller_image (base64)
  │  └─ createdAt (timestamp)
  └─ Write to Google Sheet
  
  Step 5: Return response
  └─ Return { success: true, sellerId: "1234" }
}
```

---

## Email Notification Flow

```
User Registration Request
         │
         │ Click "Yes, Register Me"
         ▼
Frontend: POST /notifyRegistrationRequest
         │
         │ Apps Script receives request
         ▼
Apps Script: notifyRegistrationRequest()
         │
         ├─ const adminEmail = 'ermes1643@gmail.com'
         │
         ├─ Create email subject:
         │  "New Seller Registration Request"
         │
         ├─ Create email body:
         │  ├─ Greeting
         │  ├─ Timestamp
         │  ├─ Explanation of pending registration
         │  ├─ Instructions to monitor Sellers sheet
         │  └─ Signature
         │
         ├─ Call: MailApp.sendEmail(
         │           adminEmail,
         │           subject,
         │           body
         │         )
         │
         └─ Return: { success: true, message: "Email sent" }
                    │
                    ├─ Frontend receives success
                    ├─ Shows success message
                    ├─ Auto-redirects to registration form
                    │
                    ▼
                Email Delivered to ermes1643@gmail.com
                ├─ In inbox (unless filtered)
                └─ Contains timestamp and instructions
```

---

## Session Management

```
SESSION LIFECYCLE

1. User Registration
   └─ Create seller
   └─ Generate ID (e.g., "1234")
   └─ Store in localStorage: { sellerId: "1234" }

2. Login
   └─ User enters ID "1234"
   └─ Verify against database
   └─ If valid: store in localStorage
   └─ Load seller info from database
   └─ Store in localStorage: { sellerInfo: {...} }

3. Navigation
   └─ Check localStorage on every page
   └─ If sellerId exists: logged in
   └─ If no sellerId: show login page

4. Logout
   └─ Clear localStorage
   └─ Redirect to request page
   └─ Session ended

5. Browser Refresh
   └─ Check localStorage for sellerId
   └─ If exists: restore session
   └─ Redirect to dashboard
   └─ No need to login again

6. Clear Browser Data
   └─ User clears cache/cookies
   └─ localStorage cleared
   └─ Session ended
   └─ User must login again
```

---

## Error Handling Flow

```
API Request
     │
     ├─ Network Error
     │  └─ Show: "Network error, please try again"
     │
     ├─ Validation Error (Form)
     │  └─ Show: "All fields are required"
     │
     ├─ Apps Script Error
     │  ├─ Try block fails
     │  └─ Show: Error message from server
     │
     ├─ Seller Not Found
     │  ├─ verifySeller returns false
     │  └─ Show: "Seller ID not found"
     │
     ├─ Product Operation Failed
     │  ├─ Add/Edit/Delete fails
     │  └─ Show: Error message
     │
     └─ Email Sending Error
        ├─ MailApp fails
        ├─ Still continue registration
        └─ Log error for manual review
```

---

This comprehensive documentation covers:
- System architecture
- Data flow
- Component relationships
- Registration flow
- Email notifications
- State management
- Error handling
- ID generation logic

