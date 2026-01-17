/**
 * GOOGLE APPS SCRIPT CODE FOR PRODUCT SUBMISSION
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1PtuTuW_S5PgdmlwbxuXvA51ZYJyEO-5vHIzzujnx9Sg/edit
 * 
 * 2. Click "Extensions" → "Apps Script" (opens editor in new tab)
 * 
 * 3. Copy and paste ALL the code below into the editor (replace default content)
 * 
 * 4. Save the script (Ctrl+S)
 * 
 * 5. Click "Deploy" → "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: your Google account
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 * 
 * 6. Copy the deployment URL (looks like: https://script.google.com/macros/d/.../usercontent)
 * 
 * 7. Add to .env in your React project:
 *    VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/.../usercontent
 * 
 * ============================================================================
 * COPY FROM BELOW TO YOUR APPS SCRIPT:
 * ============================================================================
 */

/**
 * GOOGLE APPS SCRIPT - COMPLETE SELLER & PRODUCT MANAGEMENT SYSTEM
 * 
 * This script handles:
 * - Seller registration and authentication
 * - Product CRUD operations (Create, Read, Update, Delete)
 * - Order management and email notifications
 * - Data validation and error handling
 */

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Determine operation based on data.action
    if (data.action === 'register_seller') {
      return registerSeller(data, ss);
    } else if (data.action === 'submit_seller_request') {
      return submitSellerRequest(data, ss);
    } else if (data.action === 'add_product') {
      return addProduct(data, ss);
    } else if (data.action === 'place_order') {
      return placeOrder(data, ss);
    } else if (data.action === 'notify_registration_request') {
      return notifyRegistrationRequest(ss);
    } else if (data.action === 'notify_seller_registration') {
      return notifySellerRegistration(data, ss);
    }

    return createResponse(false, 'Unknown action');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function doPut(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === 'edit_product') {
      return editProduct(data, ss);
    }

    return createResponse(false, 'Unknown PUT action');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function doDelete(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === 'delete_product') {
      return deleteProduct(data, ss);
    }

    return createResponse(false, 'Unknown DELETE action');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = e.parameter.action;
    const sellerId = e.parameter.sellerId;
    const seller_name = e.parameter.seller_name;

    if (action === 'get_seller_products' && sellerId) {
      return getSellerProducts(sellerId, ss);
    } else if (action === 'get_seller_info' && sellerId) {
      return getSellerInfo(sellerId, ss);
    } else if (action === 'verify_seller' && sellerId) {
      return verifySeller(sellerId, ss);
    } else if (action === 'get_seller_email_by_name' && seller_name) {
      return getSellerEmailByName(seller_name, ss);
    }

    return createResponse(false, 'Unknown GET action');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

// ============================================================================
// SELLER OPERATIONS
// ============================================================================

function registerSeller(data, ss) {
  // Get or create sellers sheet
  let sellersSheet = ss.getSheetByName('Sellers');
  if (!sellersSheet) {
    sellersSheet = ss.insertSheet('Sellers');
    const headers = ['sellerId', 'seller_name', 'seller_email', 'seller_whatsapp', 'seller_location', 'seller_image', 'createdAt'];
    sellersSheet.appendRow(headers);
  }

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

  // Add seller row
  const createdAt = new Date().toISOString();
  sellersSheet.appendRow([
    sellerId,
    data.seller_name || '',
    data.seller_email || '',
    data.seller_whatsapp || '',
    data.seller_location || '',
    data.seller_image || '',
    createdAt
  ]);

  return createResponse(true, 'Seller registered successfully!', { sellerId: sellerId });
}

function verifySeller(sellerId, ss) {
  const sellersSheet = ss.getSheetByName('Sellers');
  if (!sellersSheet) {
    return createResponse(false, 'Seller not found');
  }

  const data = sellersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Convert both to string for comparison to handle type mismatches
    if (String(data[i][0]) === String(sellerId)) {
      return createResponse(true, 'Seller verified', {
        seller_name: data[i][1],
        seller_email: data[i][2],
        seller_whatsapp: data[i][3],
        seller_location: data[i][4],
        seller_image: data[i][5]
      });
    }
  }

  return createResponse(false, 'Seller not found');
}

function getSellerInfo(sellerId, ss) {
  const sellersSheet = ss.getSheetByName('Sellers');
  if (!sellersSheet) {
    return createResponse(false, 'Seller not found');
  }

  const data = sellersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Convert both to string for comparison to handle type mismatches
    if (String(data[i][0]) === String(sellerId)) {
      return createResponse(true, 'Seller found', {
        sellerId: data[i][0],
        seller_name: data[i][1],
        seller_email: data[i][2],
        seller_whatsapp: data[i][3],
        seller_location: data[i][4],
        seller_image: data[i][5]
      });
    }
  }

  return createResponse(false, 'Seller not found');
}

function getSellerEmailByName(seller_name, ss) {
  const sellersSheet = ss.getSheetByName('Sellers');
  if (!sellersSheet) {
    return createResponse(false, 'Seller not found');
  }

  const data = sellersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Match by seller_name (case-insensitive)
    if ((data[i][1] || '').toLowerCase() === (seller_name || '').toLowerCase()) {
      return createResponse(true, 'Seller found', {
        seller_email: data[i][2]
      });
    }
  }

  return createResponse(false, 'Seller not found');
}

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

function addProduct(data, ss) {
  let productsSheet = ss.getSheetByName('Products');
  if (!productsSheet) {
    productsSheet = ss.insertSheet('Products');
    const headers = [
      'id', 'sellerId', 'product_name', 'product_image_url', 'image_1', 'image_2', 'image_3',
      'seller_name', 'seller_image', 'seller_whatsapp', 'seller_email', 'seller_location',
      'description', 'price', 'rating', 'category', 'location_google_maps_link',
      'isBestSeller', 'salesCount', 'createdAt'
    ];
    productsSheet.appendRow(headers);
  }

  const id = Utilities.getUuid();
  const createdAt = new Date().toISOString();

  const row = [
    id, data.sellerId || '',
    data.product_name || '', data.product_image_url || '',
    data.image_1 || '', data.image_2 || '', data.image_3 || '',
    data.seller_name || '', data.seller_image || '',
    data.seller_whatsapp || '', data.seller_email || '', data.seller_location || '',
    data.description || '', data.price || 0, data.rating || 0,
    data.category || '', data.location_google_maps_link || '',
    data.isBestSeller ? 'TRUE' : 'FALSE', data.salesCount || 0, createdAt
  ];

  productsSheet.appendRow(row);
  return createResponse(true, 'Product added successfully!', { productId: id });
}

function editProduct(data, ss) {
  const productsSheet = ss.getSheetByName('Products');
  if (!productsSheet) {
    return createResponse(false, 'Products sheet not found');
  }

  const sheetData = productsSheet.getDataRange().getValues();
  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === data.productId && sheetData[i][1] === data.sellerId) {
      // Update product row
      const row = i + 1;
      productsSheet.getRange(row, 3, 1, 17).setValues([[
        data.product_name || sheetData[i][2],
        data.product_image_url || sheetData[i][3],
        data.image_1 || sheetData[i][4],
        data.image_2 || sheetData[i][5],
        data.image_3 || sheetData[i][6],
        data.seller_name || sheetData[i][7],
        data.seller_image || sheetData[i][8],
        data.seller_whatsapp || sheetData[i][9],
        data.seller_email || sheetData[i][10],
        data.seller_location || sheetData[i][11],
        data.description || sheetData[i][12],
        data.price !== undefined ? data.price : sheetData[i][13],
        data.rating !== undefined ? data.rating : sheetData[i][14],
        data.category || sheetData[i][15],
        data.location_google_maps_link || sheetData[i][16],
        data.isBestSeller ? 'TRUE' : 'FALSE'
      ]]);
      return createResponse(true, 'Product updated successfully!');
    }
  }

  return createResponse(false, 'Product not found or unauthorized');
}

function deleteProduct(data, ss) {
  const productsSheet = ss.getSheetByName('Products');
  if (!productsSheet) {
    return createResponse(false, 'Products sheet not found');
  }

  const sheetData = productsSheet.getDataRange().getValues();
  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === data.productId && sheetData[i][1] === data.sellerId) {
      productsSheet.deleteRow(i + 1);
      return createResponse(true, 'Product deleted successfully!');
    }
  }

  return createResponse(false, 'Product not found or unauthorized');
}

function getSellerProducts(sellerId, ss) {
  const productsSheet = ss.getSheetByName('Products');
  if (!productsSheet) {
    return createResponse(true, 'No products found', { products: [] });
  }

  const sheetData = productsSheet.getDataRange().getValues();
  const products = [];

  for (let i = 1; i < sheetData.length; i++) {
    // Convert both to string to avoid type mismatches (number vs string)
    if (String(sheetData[i][1]) === String(sellerId)) {
      products.push({
        id: sheetData[i][0],
        product_name: sheetData[i][2],
        product_image_url: sheetData[i][3],
        price: sheetData[i][13],
        salesCount: sheetData[i][18]
      });
    }
  }

  return createResponse(true, 'Products found', { products: products, count: products.length });
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

function placeOrder(data, ss) {
  // Get or create orders sheet
  let ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet('Orders');
    const headers = ['orderId', 'productId', 'sellerId', 'seller_email', 'buyer_name', 'buyer_email', 'buyer_phone', 'quantity', 'total_price', 'createdAt'];
    ordersSheet.appendRow(headers);
  }

  const orderId = Utilities.getUuid();
  const createdAt = new Date().toISOString();

  // Append order
  ordersSheet.appendRow([
    orderId,
    data.productId || '',
    data.sellerId || '',
    data.seller_email || '',
    data.buyer_name || '',
    data.buyer_email || '',
    data.buyer_phone || '',
    data.quantity || 1,
    data.total_price || 0,
    createdAt
  ]);

  // Send email to seller
  if (data.seller_email) {
    sendOrderEmailToSeller(data.seller_email, data.seller_name, data.product_name, data.buyer_name, data.buyer_email, data.buyer_phone, data.quantity, data.total_price, orderId);
  }

  // Send email to admin (ermes1643@gmail.com)
  sendOrderEmailToAdmin('ermes1643@gmail.com', data.seller_name, data.product_name, data.buyer_name, data.buyer_email, data.buyer_phone, data.quantity, data.total_price, orderId);

  return createResponse(true, 'Order placed successfully!', { orderId: orderId });
}

function sendOrderEmail(sellerEmail, sellerName, productName, buyerName, quantity, totalPrice) {
  try {
    const subject = 'New Order Received!';
    const body = `
      Hi ${sellerName},

      You have received a new order!

      Product: ${productName}
      Buyer: ${buyerName}
      Quantity: ${quantity}
      Total Price: ${totalPrice} DH

      Please follow up with the buyer to complete the transaction.

      Best regards,
      ForeignFinds Morocco Team
    `;

    MailApp.sendEmail(sellerEmail, subject, body);
  } catch (error) {
    Logger.log('Email error: ' + error);
  }
}

function sendOrderEmailToSeller(sellerEmail, sellerName, productName, buyerName, buyerEmail, buyerPhone, quantity, totalPrice, orderId) {
  try {
    const subject = `New Order #${orderId}`;
    const contactInfo = buyerEmail ? `Email: ${buyerEmail}` : `Phone: ${buyerPhone}`;
    const body = `
      Hi ${sellerName},

      You have received a new order!

      Order ID: ${orderId}
      Product: ${productName}
      Buyer Name: ${buyerName}
      Buyer ${contactInfo}
      Quantity: ${quantity}
      Total Price: ${totalPrice} DH

      Please follow up with the buyer to complete the transaction.

      Best regards,
      ForeignFinds Morocco Team
    `;

    MailApp.sendEmail(sellerEmail, subject, body);
  } catch (error) {
    Logger.log('Error sending email to seller: ' + error);
  }
}

function sendOrderEmailToAdmin(adminEmail, sellerName, productName, buyerName, buyerEmail, buyerPhone, quantity, totalPrice, orderId) {
  try {
    const subject = `New Order Received #${orderId}`;
    const contactInfo = buyerEmail ? `Email: ${buyerEmail}` : `Phone: ${buyerPhone}`;
    const body = `
      New order received on ForeignFinds Morocco!

      Order ID: ${orderId}
      Seller: ${sellerName}
      Product: ${productName}
      Buyer Name: ${buyerName}
      Buyer ${contactInfo}
      Quantity: ${quantity}
      Total Price: ${totalPrice} DH

      Please monitor this order and ensure timely completion.

      Best regards,
      ForeignFinds Morocco System
    `;

    MailApp.sendEmail(adminEmail, subject, body);
  } catch (error) {
    Logger.log('Error sending email to admin: ' + error);
  }
}

// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================

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

function submitSellerRequest(data, ss) {
  try {
    const sellersSheetName = 'Sellers';
    let sellersSheet = ss.getSheetByName(sellersSheetName);
    if (!sellersSheet) {
      sellersSheet = ss.insertSheet(sellersSheetName);
      const headers = ['sellerId', 'seller_name', 'seller_email', 'seller_whatsapp', 'seller_location', 'seller_image', 'createdAt'];
      sellersSheet.appendRow(headers);
    }

    const createdAt = new Date().toISOString();

    // Append the seller request with an EMPTY sellerId column for admin to fill later
    sellersSheet.appendRow([
      '',
      data.seller_name || '',
      data.seller_email || '',
      data.seller_whatsapp || '',
      data.seller_location || '',
      data.seller_image || '',
      createdAt
    ]);

    // Send admin email with full seller details
    const adminEmail = 'ermes1643@gmail.com';
    const subject = `New Seller Request - ${data.seller_name || 'Unnamed'}`;
    const body = `A new seller has requested to join ForeignFinds Morocco.\n\n` +
      `Name: ${data.seller_name || 'N/A'}\n` +
      `Email: ${data.seller_email || 'N/A'}\n` +
      `WhatsApp: ${data.seller_whatsapp || 'N/A'}\n` +
      `Location: ${data.seller_location || 'N/A'}\n` +
      `Submitted At: ${createdAt}\n\n` +
      `Note: sellerId column is left empty. Please assign an ID in the Sellers sheet when approving.`;

    MailApp.sendEmail(adminEmail, subject, body);

    return createResponse(true, 'Seller request submitted');
  } catch (error) {
    Logger.log('submitSellerRequest error: ' + error);
    return createResponse(false, 'Failed to submit seller request');
  }
}

function notifySellerRegistration(data, ss) {
  try {
    const adminEmail = 'ermes1643@gmail.com';
    const sellerData = data.sellerData || {};
    const sellerId = data.sellerId || 'Unknown';
    
    const subject = `New Seller Registration - ${sellerData.seller_name || 'New Seller'}`;
    const body = `
      A new seller has registered on ForeignFinds Morocco!

      Seller ID: ${sellerId}
      Seller Name: ${sellerData.seller_name || 'N/A'}
      Email: ${sellerData.seller_email || 'N/A'}
      WhatsApp: ${sellerData.seller_whatsapp || 'N/A'}
      Location: ${sellerData.seller_location || 'N/A'}
      Registration Time: ${new Date().toString()}

      The seller has been given ID: ${sellerId}
      They can now login with this ID and start adding products.

      Best regards,
      ForeignFinds Morocco System
    `;

    MailApp.sendEmail(adminEmail, subject, body);
    return createResponse(true, 'Seller registration notification sent');
  } catch (error) {
    Logger.log('Seller notification error: ' + error);
    return createResponse(false, 'Failed to send notification');
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function createResponse(success, message, data = {}) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: success,
      message: message,
      ...data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ============================================================================
 * END OF APPS SCRIPT CODE
 * ============================================================================
 * 
 * After deployment:
 * 1. Copy the deployment URL from the "Manage deployments" section
 * 2. In your React .env file, add: VITE_APPS_SCRIPT_URL=<your_deployment_url>
 * 3. Products submitted via the form will now appear in your Google Sheet!
 * 
 * TROUBLESHOOTING:
 * - If you get a CORS error, make sure the deployment is set to "Anyone" access
 * - If rows aren't appearing, check the Apps Script execution logs
 * - Make sure your sheet is public or accessible to the Apps Script
 */

