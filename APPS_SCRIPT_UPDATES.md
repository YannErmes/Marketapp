# Apps Script Updates - Seller Registration System

## What Changed

### 1. Seller ID Generation
**Before:** 8-character UUID format (e.g., "ABC12D34")
**After:** 4-digit number format (e.g., "1234")

### 2. New Notification Function
**Added:** `notifyRegistrationRequest()` function
**Purpose:** Send email to admin when registration requested

## Key Functions

### notifyRegistrationRequest()
```javascript
function notifyRegistrationRequest(ss) {
  try {
    const adminEmail = 'ermes1643@gmail.com';
    const subject = 'New Seller Registration Request';
    const body = `
      A new seller wants to register on ForeignFinds Morocco!

      Timestamp: ${new Date().toString()}

      The user is currently completing their profile registration.
      Once they complete their information, they will receive a seller ID to login.

      Please monitor the 'Sellers' sheet for new registrations.

      Best regards,
      ForeignFinds Morocco System
    `;

    MailApp.sendEmail(adminEmail, subject, body);
    return createResponse(true, 'Registration request notification sent');
  } catch (error) {
    Logger.log('Notification error: ' + error);
    return createResponse(false, 'Failed to send notification');
  }
}
```

### registerSeller() - Updated ID Generation
```javascript
// Generate unique 4-digit seller ID (1000-9999)
let sellerId;
let isUnique = false;
const existingIds = new Set();

const sheetData = sellersSheet.getDataRange().getValues();
for (let i = 1; i < sheetData.length; i++) {
  existingIds.add(sheetData[i][0]);
}

while (!isUnique) {
  sellerId = String(Math.floor(Math.random() * 9000) + 1000);
  if (!existingIds.has(sellerId)) {
    isUnique = true;
  }
}
```

## How It Works

### Registration Request (notify_registration_request)
1. Frontend sends POST request with action "notify_registration_request"
2. Apps Script calls `notifyRegistrationRequest()`
3. Email sent to ermes1643@gmail.com
4. Returns success/failure response

### Seller Registration (register_seller)
1. Frontend sends POST request with seller data
2. Apps Script generates unique 4-digit ID
3. Validates ID doesn't already exist
4. Adds new row to Sellers sheet
5. Returns generated ID to frontend

## Updated doPost() Handler

```javascript
function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === 'register_seller') {
      return registerSeller(data, ss);
    } else if (data.action === 'add_product') {
      return addProduct(data, ss);
    } else if (data.action === 'place_order') {
      return placeOrder(data, ss);
    } else if (data.action === 'notify_registration_request') {
      return notifyRegistrationRequest(ss);
    }

    return createResponse(false, 'Unknown action');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}
```

## API Endpoints

### POST: notify_registration_request
**Request:**
```json
{
  "action": "notify_registration_request",
  "timestamp": "2024-01-17T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration request notification sent"
}
```

### POST: register_seller
**Request:**
```json
{
  "action": "register_seller",
  "seller_name": "John Doe",
  "seller_email": "john@example.com",
  "seller_whatsapp": "+212612345678",
  "seller_location": "Marrakech",
  "seller_image": "base64_image_data_or_empty_string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Seller registered successfully!",
  "sellerId": "4729"
}
```

## Deployment Instructions

1. **Access Apps Script:**
   - Open Google Sheet: https://docs.google.com/spreadsheets/d/1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg/edit
   - Click Extensions → Apps Script

2. **Copy new code:**
   - Delete all existing code
   - Paste code from `APPS_SCRIPT_DEPLOYMENT.md`

3. **Save:**
   - Press Ctrl+S
   - Wait for save confirmation

4. **Deploy:**
   - Click "Deploy" button
   - Select "Manage deployments"
   - Click "Create new deployment"
   - Choose type: "Web app"
   - Execute as: Your Google account
   - Access: "Anyone"
   - Click "Deploy"

5. **Copy URL:**
   - Copy the deployment URL
   - Update in React `.env` file:
     ```
     VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_URL/exec
     ```

6. **Test:**
   - Run `npm run dev`
   - Click Seller Portal
   - Test registration flow
   - Verify email received

## Configuration

### Admin Email
To change the admin notification email:

1. In Apps Script editor, find function: `notifyRegistrationRequest(ss)`
2. Change this line:
   ```javascript
   const adminEmail = 'ermes1643@gmail.com';
   ```
   To:
   ```javascript
   const adminEmail = 'newemail@example.com';
   ```
3. Save and deploy

### ID Generation Range
To change seller ID range:

Current: 1000-9999 (4-digit numbers)

To change to different range:
```javascript
// Current: 1000-9999
sellerId = String(Math.floor(Math.random() * 9000) + 1000);

// Example: 100000-999999 (6-digit)
sellerId = String(Math.floor(Math.random() * 900000) + 100000);

// Example: 10-99 (2-digit)
sellerId = String(Math.floor(Math.random() * 90) + 10);
```

## Troubleshooting

### Email Not Sending
**Possible causes:**
- Email account doesn't have permission to send emails
- Gmail account security settings blocking
- Apps Script account not authenticated

**Solution:**
1. Ensure you're logged into correct Google account
2. Grant necessary permissions when prompted
3. Check Apps Script execution logs

### Duplicate IDs
**Possible cause:** Race condition with multiple simultaneous registrations

**Current safeguard:** Checks all existing IDs before generating new one

**Solution if occurs:** Manual edit in Google Sheet to change duplicate ID

### Sheet Not Found
**Error:** "Products sheet not found"

**Cause:** Sheet doesn't exist or has different name

**Solution:** Apps Script auto-creates sheets if missing. Check sheet names match exactly:
- "Sellers"
- "Products"
- "Orders"

## Database Schema

### Sellers Sheet Headers
```
A: sellerId          (4-digit number, unique)
B: seller_name       (string)
C: seller_email      (string)
D: seller_whatsapp   (phone number string)
E: seller_location   (string)
F: seller_image      (base64 image data)
G: createdAt         (ISO 8601 timestamp)
```

### Example Row
```
1234 | John Doe | john@example.com | +212612345678 | Marrakech | [base64_image] | 2024-01-17T10:30:00.000Z
```

## Logs & Debugging

### View Execution Logs
1. Go to Apps Script editor
2. Click "Execution log" at bottom
3. See detailed logs of each function call
4. Use `Logger.log()` for debugging

### Common Log Messages
```
Starting registerSeller with data: {...}
Generating unique seller ID
ID 1234 is already taken
ID 5678 is unique, using it
Email notification sent successfully
```

## Performance Notes

- ID generation: O(n) where n = number of existing sellers
- For 1000+ sellers, may take a moment
- Acceptable performance for MVP
- Could optimize with indexed lookup in future

## Security Considerations

- No authentication required for registration
- ID validation on retrieval (verifySeller)
- Email notifications for audit trail
- Seller IDs are public (visible in URLs)
- Consider adding email verification in future

## Future Improvements

1. **Email Verification:**
   - Send verification link to seller email
   - Only activate after email confirmed

2. **Password Authentication:**
   - Add password field to registration
   - Use hashing for security

3. **Seller Approval:**
   - Admin review and approve new sellers
   - Email approval confirmation

4. **ID Format Options:**
   - Custom seller usernames
   - Memorable slugs instead of numbers

5. **Rate Limiting:**
   - Prevent spam registrations
   - Track registrations per IP

## Testing Checklist

- [ ] Registration request email sent
- [ ] Email received at ermes1643@gmail.com
- [ ] 4-digit ID generated
- [ ] ID is unique
- [ ] Seller added to Sellers sheet
- [ ] Login works with generated ID
- [ ] Dashboard loads with seller info
- [ ] Products can be added
- [ ] Order emails work

