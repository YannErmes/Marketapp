# 🚀 Deployment Checklist - Seller Portal Update

## Pre-Deployment Verification

### Local Testing ✓
- [x] Development server running (`npm run dev`)
- [x] Dev server URL: http://localhost:8081/
- [x] No compilation errors
- [x] Components loading without errors

### Code Review ✓
- [x] All files created successfully
- [x] All imports and exports correct
- [x] TypeScript types properly defined
- [x] No unused imports or variables

---

## Step 1: Update Google Apps Script

### ✓ Access Apps Script
1. Go to Google Sheet: https://docs.google.com/spreadsheets/d/1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg/edit
2. Click **Extensions** → **Apps Script**
3. New tab opens with Apps Script editor

### ✓ Replace Code
1. Select **all** code in editor (Ctrl+A)
2. Delete selected code
3. Copy entire code from `APPS_SCRIPT_DEPLOYMENT.md`
4. Paste into Apps Script editor
5. Verify code looks correct (should show no red errors)

### ✓ Save
- Press **Ctrl+S**
- Wait for save confirmation message
- Status bar shows: "Saved"

### ✓ Check for Errors
1. Click on any line of code
2. Look for red squiggly underlines (errors)
3. No errors should appear
4. Check the console at bottom (no errors logged)

---

## Step 2: Deploy New Version

### ✓ Create New Deployment
1. Click **Deploy** button (top right)
2. Select **Manage deployments** (if "Deploy" shows options)
3. Or click **Create new deployment** (the + icon)
4. Choose Deployment type:
   - Type: **Web app**
   - Execute as: **Your Google Account**
   - Who has access: **Anyone**
5. Click **Deploy**
6. Click **Authorize** if prompted (grant permissions)

### ✓ Copy Deployment URL
1. Deployment creates a new URL
2. You'll see: "Web app is deployed at:"
3. Copy the full URL (looks like: `https://script.google.com/macros/s/AKf.../exec`)
4. Save this URL for Step 3

### ✓ Optional: Update Old Deployment
If you have an old deployment to keep:
1. Find it in "Manage deployments"
2. Either delete old versions or keep for backup
3. Use the new URL for .env

---

## Step 3: Update React Environment

### ✓ Update .env File
1. Open `c:\Users\Admin\Downloads\foreignfinds-morocco-main\foreignfinds-morocco-main\.env`
2. Update or verify these lines:
```env
VITE_SHEET_ID=1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/[YOUR_NEW_URL]/exec
```
3. Replace `[YOUR_NEW_URL]` with the URL from Step 2
4. Save the file (Ctrl+S)

### ✓ Update .env.example (For version control)
1. Open `.env.example`
2. Update the `VITE_APPS_SCRIPT_URL` line with new URL
3. Save the file

### ✓ Verify Configuration
- Sheet ID: Present and correct? ✓
- Apps Script URL: Valid format? ✓
- No stray spaces or quotes? ✓

---

## Step 4: Test Locally Before Deploying

### ✓ Start Development Server
```bash
npm run dev
```
Output should show:
```
VITE v5.4.19  ready in XXX ms
➜  Local:   http://localhost:8081/
```

### ✓ Test Registration Flow
1. Open http://localhost:8081/ in browser
2. Click small "Seller" button in header (top right)
3. See registration request modal
4. Click "Yes, Register Me"
5. Check browser console for errors (press F12)
6. Should see success message
7. Should redirect to registration form
8. Fill form:
   - Name: "Test Seller"
   - Email: "test@example.com"
   - WhatsApp: "+212612345678"
   - Location: "Test City"
9. Submit form
10. Should see:
    - ✓ Success message
    - ✓ 4-digit ID displayed (e.g., "1234")
    - ✓ Copy button visible
    - ✓ Auto-redirect message

### ✓ Test Email Notification
1. Check email: ermes1643@gmail.com
2. Should have new email with:
   - Subject: "New Seller Registration Request"
   - Timestamp of when you submitted
   - Instructions to monitor Sellers sheet
3. Email may take 1-2 minutes to arrive

### ✓ Verify Google Sheet Updated
1. Go to Google Sheet
2. Open "Sellers" tab/sheet
3. Should see new row with:
   - Column A: 4-digit number (e.g., "1234")
   - Column B: "Test Seller"
   - Column C: "test@example.com"
   - Column D: "+212612345678"
   - Column E: "Test City"
   - Column F: Empty or image data
   - Column G: Timestamp

### ✓ Test Seller Login
1. Back to http://localhost:8081/
2. Click "Seller" button again
3. Should see login form
4. Enter the ID displayed earlier (e.g., "1234")
5. Click login
6. Should see seller dashboard with:
   - Seller profile info
   - Products grid (empty if first time)
   - Add new product button

### ✓ Test Product Management
1. Click "Add New Product" button
2. Add test product
3. Submit product
4. Should appear in products grid
5. Test delete button
6. Should remove product from dashboard
7. Check Google Sheet "Products" tab
8. Verify product appears there

---

## Step 5: Build for Production

### ✓ Stop Development Server
- Press **Ctrl+C** in terminal
- Terminal should return to command prompt

### ✓ Build Project
```bash
npm run build
```
Output should show:
```
✓ compiled successfully
```

### ✓ Verify Build
1. Check for `dist/` folder creation
2. Should contain:
   - `index.html`
   - `assets/` folder with JS/CSS files
   - Total size reasonable (< 500KB)

### ✓ Preview Build (Optional)
```bash
npm run preview
```
This opens preview at http://localhost:4173/
Test the build works before deploying to server

---

## Step 6: Deploy to Production

### ✓ Prepare Deployment Files
1. The `dist/` folder contains all production files
2. No need to deploy `node_modules/` or source files
3. Just upload contents of `dist/` folder

### ✓ Choose Hosting
Popular options:
- **Vercel** (easiest for React)
- **Netlify** (good UI builder integration)
- **AWS S3 + CloudFront**
- **GitHub Pages**
- **Your own server**

### ✓ Deploy Steps (Vercel Example)
1. Go to vercel.com
2. Connect GitHub repo
3. Select branch to deploy
4. Vercel auto-builds and deploys
5. Sets up CDN and HTTPS

### ✓ Deploy Steps (Netlify Example)
1. Go to netlify.com
2. Select "New site from Git"
3. Choose GitHub repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy

### ✓ Deploy Steps (Manual Server)
1. Upload contents of `dist/` folder to web server
2. Ensure `index.html` is accessible at root
3. Configure server for SPA (Single Page App):
   - All routes should serve `index.html`
4. Enable GZIP compression
5. Set cache headers for assets

---

## Step 7: Post-Deployment Verification

### ✓ Test Live Website
1. Go to your live URL (e.g., yoursite.com)
2. Verify site loads without errors
3. Click "Seller" button
4. Test complete registration flow
5. Check email notification sent
6. Verify Google Sheet updated
7. Test seller login and dashboard

### ✓ Monitor Google Analytics (If enabled)
1. Check for traffic
2. Monitor errors in console
3. Track user registration conversions

### ✓ First Real Seller Registration
1. Wait for first real seller to register
2. Verify email notification received
3. Verify seller appears in Google Sheet
4. Verify seller can login
5. Have seller test adding products
6. Monitor performance

---

## Important Notes

### Admin Email Configuration
- Currently set to: **ermes1643@gmail.com**
- Receives all registration request notifications
- To change: Update Apps Script `notifyRegistrationRequest()` function

### Seller ID Format
- Format: 4-digit number (1000-9999)
- Examples: 1234, 5678, 9999
- Generated automatically, no customization needed

### Google Sheet Access
- Sheet must remain shared/accessible
- Apps Script needs edit access
- Don't delete header rows in sheets

### Backup Recommendation
Before deploying:
1. Backup your Google Sheet
2. File → Make a copy
3. Keep copy as safety backup

---

## Troubleshooting During Deployment

### Issue: "Apps Script URL not configured"
**Solution:** 
- Check .env file has VITE_APPS_SCRIPT_URL
- Restart `npm run dev` after updating .env
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Email not sending"
**Solution:**
- Verify ermes1643@gmail.com is correct
- Check Apps Script execution logs
- Ensure Google account has permission to send emails

### Issue: "4-digit ID not generated"
**Solution:**
- Check Apps Script logs for errors
- Verify Sellers sheet exists and has headers
- Check Google Sheet is accessible
- Redeploy Apps Script

### Issue: "Login fails with correct ID"
**Solution:**
- Verify ID exists in Sellers sheet
- Check for spaces or special characters in ID
- Clear browser cache and cookies
- Try incognito/private window

### Issue: "Products not appearing"
**Solution:**
- Verify seller ID is correct
- Check Products sheet has correct sellerId in products
- Verify Apps Script URL is correct in .env
- Check browser console for errors (F12)

---

## Final Checklist

### Before Going Live
- [ ] Apps Script code deployed
- [ ] .env file updated with new URL
- [ ] Local testing completed successfully
- [ ] Email notifications verified working
- [ ] Google Sheet shows test seller
- [ ] Seller login and dashboard working
- [ ] Production build created (`npm run build`)
- [ ] Site deployed to hosting
- [ ] Live URL tested and working

### After Going Live
- [ ] Monitor first few registrations
- [ ] Check email notifications arriving
- [ ] Verify sellers can login
- [ ] Verify sellers can add products
- [ ] Monitor for any errors
- [ ] Respond to seller support requests
- [ ] Monitor performance metrics

---

## Rollback Plan (If Issues)

If something breaks:
1. Revert previous Apps Script deployment:
   - Go to Apps Script
   - Click Manage Deployments
   - Select previous version
2. Or redeploy with old code:
   - Copy from backup/version control
   - Deploy new version
3. Update .env if needed to old URL
4. Restart development server

---

## Success Indicators

You'll know everything is working when:
✅ Seller button visible in header
✅ Registration request modal appears
✅ Email sent to admin on registration request
✅ Seller registration form works
✅ 4-digit ID generated and displayed
✅ Email notification received
✅ Google Sheet shows new seller
✅ Seller can login with ID
✅ Dashboard loads with profile info
✅ Products can be added/edited/deleted
✅ Order notifications working

---

## Support Contacts

If you need help:
- **Admin Email:** ermes1643@gmail.com
- **Check Documentation:** See SELLER_PORTAL_* files
- **View Apps Script Logs:** Extensions → Apps Script → Execution Log
- **Check Console:** F12 → Console tab in browser

---

## Documentation Links

Quick reference while deploying:
- 📖 `COMPLETION_SUMMARY.md` - Overview of changes
- 📖 `SELLER_PORTAL_UPDATE.md` - Detailed changes
- 📖 `APPS_SCRIPT_UPDATES.md` - Backend details
- 📖 `APPS_SCRIPT_DEPLOYMENT.md` - Full code
- 📖 `SELLER_PORTAL_QUICK_REFERENCE.md` - Quick guide

---

**Status: READY FOR DEPLOYMENT** ✅

All updates implemented, tested locally, and documented.
Ready to deploy to production servers.

