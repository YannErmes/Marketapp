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
    } else if (data.action === 'place_bulk_order') {
      return placeBulkOrder(data, ss);
    } else if (data.action === 'notify_registration_request') {
      return notifyRegistrationRequest(ss);
    } else if (data.action === 'notify_seller_registration') {
      return notifySellerRegistration(data, ss);
    } else if (data.action === 'track_daily_visitor') {
      return trackDailyVisitor(data, ss);
    } else if (data.action === 'delete_product') {
      return deleteProduct(data, ss);
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

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = e.parameter.action;
    const sellerId = e.parameter.sellerId;
    const seller_name = e.parameter.seller_name;
    const date = e.parameter.date;
    const productId = e.parameter.productId;

    if (action === 'get_seller_products' && sellerId) {
      return getSellerProducts(sellerId, ss);
    } else if (action === 'get_seller_info' && sellerId) {
      return getSellerInfo(sellerId, ss);
    } else if (action === 'verify_seller' && sellerId) {
      return verifySeller(sellerId, ss);
    } else if (action === 'get_seller_email_by_name' && seller_name) {
      return getSellerEmailByName(seller_name, ss);
    } else if (action === 'get_today_visitor_count' && date) {
      return getTodayVisitorCount(date, ss);
    } else if (action === 'get_product_by_id' && productId) {
      return getProductById(productId, ss);
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
  try {
    const productsSheet = ss.getSheetByName('Products');
    if (!productsSheet) {
      Logger.log('deleteProduct: Products sheet not found');
      return createResponse(false, 'Products sheet not found');
    }

    const sheetData = productsSheet.getDataRange().getValues();
    const targetProductId = String(data.productId || '');
    const targetSellerId = data.sellerId !== undefined ? String(data.sellerId) : null;

    Logger.log('deleteProduct called with productId=%s sellerId=%s', targetProductId, targetSellerId);

    let foundIndex = -1;
    let sellerMismatchIndex = -1;

    for (let i = 1; i < sheetData.length; i++) {
      const rowProductId = String(sheetData[i][0] || '');
      const rowSellerId = String(sheetData[i][1] || '');

      if (rowProductId === targetProductId && targetSellerId !== null && rowSellerId === targetSellerId) {
        foundIndex = i;
        break;
      }

      if (rowProductId === targetProductId && sellerMismatchIndex === -1) {
        sellerMismatchIndex = i;
      }
    }

    if (foundIndex > -1) {
      productsSheet.deleteRow(foundIndex + 1);
      Logger.log('deleteProduct: deleted row %s (authorized)', foundIndex + 1);
      return createResponse(true, 'Product deleted successfully');
    }

    // If product exists but sellerId mismatched, delete anyway but warn
    if (sellerMismatchIndex > -1) {
      productsSheet.deleteRow(sellerMismatchIndex + 1);
      Logger.log('deleteProduct: deleted row %s (sellerId mismatch). Provided sellerId=%s', sellerMismatchIndex + 1, targetSellerId);
      return createResponse(true, 'Product deleted (sellerId mismatch).');
    }

    Logger.log('deleteProduct: productId not found in sheet - productId=%s', targetProductId);
    return createResponse(false, 'Product not found or unauthorized');
  } catch (err) {
    Logger.log('deleteProduct error: ' + err);
    return createResponse(false, 'Error deleting product: ' + String(err));
  }
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

function getProductById(productId, ss) {
  const productsSheet = ss.getSheetByName('Products');
  if (!productsSheet) {
    return createResponse(false, 'Products sheet not found');
  }

  const sheetData = productsSheet.getDataRange().getValues();
  const targetId = String(productId || '');

  // Column mapping: 0=id, 1=sellerId, 2=product_name, 3=product_image_url, 4=image_1, 5=image_2, 6=image_3,
  // 7=seller_name, 8=seller_image, 9=seller_whatsapp, 10=seller_email, 11=seller_location,
  // 12=description, 13=price, 14=rating, 15=category, 16=location_google_maps_link,
  // 17=isBestSeller, 18=salesCount, 19=createdAt
  for (let i = 1; i < sheetData.length; i++) {
    const rowId = String(sheetData[i][0] || '');
    if (rowId === targetId) {
      const additionalImages = [
        sheetData[i][3] || '',
        sheetData[i][4] || '',
        sheetData[i][5] || '',
        sheetData[i][6] || ''
      ].filter(img => img);

      return createResponse(true, 'Product found', {
        id: sheetData[i][0],
        product_name: sheetData[i][2],
        product_image_url: sheetData[i][3],
        seller_name: sheetData[i][7],
        seller_image: sheetData[i][8],
        seller_whatsapp: sheetData[i][9],
        seller_email: sheetData[i][10],
        seller_location: sheetData[i][11],
        description: sheetData[i][12],
        price: sheetData[i][13],
        rating: sheetData[i][14],
        category: sheetData[i][15],
        location_google_maps_link: sheetData[i][16],
        additional_images: additionalImages,
        isBestSeller: sheetData[i][17] === 'TRUE' || sheetData[i][17] === true,
        salesCount: sheetData[i][18]
      });
    }
  }

  return createResponse(false, 'Product not found');
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

function placeOrder(data, ss) {
  // Get or create orders sheet
  let ordersSheet = ss.getSheetByName('Orders');
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet('Orders');
    const headers = ['orderId', 'productId', 'sellerId', 'seller_email', 'seller_phone', 'buyer_name', 'buyer_email', 'buyer_phone', 'quantity', 'total_price', 'createdAt'];
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
    data.seller_phone || '',
    data.buyer_name || '',
    data.buyer_email || '',
    data.buyer_phone || '',
    data.quantity || 1,
    data.total_price || 0,
    createdAt
  ]);
  // Attempt to determine seller email if not provided by payload
  let sellerEmail = data.seller_email || '';
  try {
    if (!sellerEmail) {
      sellerEmail = getSellerEmailInternal(data.sellerId, data.seller_name, ss) || '';
      Logger.log('placeOrder: looked up sellerEmail=%s for sellerId=%s seller_name=%s', sellerEmail, data.sellerId, data.seller_name);
    }
  } catch (lookupErr) {
    Logger.log('placeOrder lookup error: ' + lookupErr);
  }

  // Send email to seller if we have an email
  let sellerEmailSent = false;
  if (sellerEmail) {
    try {
      sendOrderEmailToSeller(sellerEmail, data.seller_name, data.product_name, data.buyer_name, data.buyer_email, data.buyer_phone, data.quantity, data.total_price, orderId);
      sellerEmailSent = true;
    } catch (emailErr) {
      Logger.log('Error sending email to seller (%s): %s', sellerEmail, String(emailErr));
      sellerEmailSent = false;
    }
  } else {
    Logger.log('placeOrder: no seller email available for productId=%s sellerId=%s seller_name=%s', data.productId, data.sellerId, data.seller_name);
  }

  // Send email to admin (ermes1643@gmail.com) including seller contact info
  try {
    sendOrderEmailToAdmin('ermes1643@gmail.com', data.seller_name, sellerEmail || '', data.seller_phone || '', data.product_name, data.buyer_name, data.buyer_email, data.buyer_phone, data.quantity, data.total_price, orderId);
  } catch (adminEmailErr) {
    Logger.log('Error sending admin email for order %s: %s', orderId, String(adminEmailErr));
  }

  return createResponse(true, 'Order placed successfully!', { orderId: orderId, sellerEmail: sellerEmail, sellerEmailSent: sellerEmailSent });
}

/**
 * Handle bulk orders placed via "Order All" button from the frontend.
 * Expected payload: { buyer_name, buyer_email, buyer_phone, items: [{ productId, sellerId, seller_email, seller_name, product_name, quantity, total_price }] }
 */
function placeBulkOrder(data, ss) {
  try {
    const items = data.items || [];
    if (!items.length) {
      return createResponse(false, 'No items provided');
    }

    // Ensure Orders sheet exists
    let ordersSheet = ss.getSheetByName('Orders');
    if (!ordersSheet) {
      ordersSheet = ss.insertSheet('Orders');
      const headers = ['orderId', 'productId', 'sellerId', 'seller_email', 'seller_phone', 'buyer_name', 'buyer_email', 'buyer_phone', 'quantity', 'total_price', 'createdAt'];
      ordersSheet.appendRow(headers);
    }

    const adminEmail = 'ermes1643@gmail.com';
    const createdAt = new Date().toISOString();
    const orderIds = [];
    let grandTotal = 0;

    // Group items by seller for per-seller emails
    const sellers = {};

    items.forEach(function(item) {
      const orderId = Utilities.getUuid();
      orderIds.push(orderId);

      // If seller email missing, attempt to look it up
      let itemSellerEmail = item.seller_email || '';
      try {
        if (!itemSellerEmail) {
          itemSellerEmail = getSellerEmailInternal(item.sellerId, item.seller_name, ss) || '';
        }
      } catch (lookupErr) {
        Logger.log('placeBulkOrder lookup error for product %s: %s', item.productId, lookupErr);
      }

      ordersSheet.appendRow([
        orderId,
        item.productId || '',
        item.sellerId || '',
        itemSellerEmail || '',
        item.seller_phone || '',
        data.buyer_name || '',
        data.buyer_email || '',
        data.buyer_phone || '',
        item.quantity || 1,
        item.total_price || 0,
        new Date().toISOString()
      ]);

      grandTotal += Number(item.total_price || 0);

      const sid = item.sellerId || 'unknown';
      if (!sellers[sid]) {
        sellers[sid] = { seller_email: item.seller_email || '', seller_phone: item.seller_phone || '', seller_name: item.seller_name || '', items: [] };
      }

      // if seller_email is blank in our grouping, replace with looked-up email if available
      if (!sellers[sid].seller_email) {
        try {
          const lookedUp = getSellerEmailInternal(item.sellerId, item.seller_name, ss) || '';
          if (lookedUp) {
            sellers[sid].seller_email = lookedUp;
            Logger.log('placeBulkOrder: looked up email for seller %s -> %s', sid, lookedUp);
          }
        } catch (err) {
          Logger.log('placeBulkOrder lookup error for seller %s: %s', sid, err);
        }
      }

      sellers[sid].items.push({ product_name: item.product_name, quantity: item.quantity || 1, total_price: item.total_price || 0, orderId: orderId });
    });

    // Send per-seller email summaries
    for (const sid in sellers) {
      const s = sellers[sid];
      if (s.seller_email) {
        sendBulkEmailToSeller(s.seller_email, s.seller_name, s.items, data.buyer_name, data.buyer_email, data.buyer_phone);
      } else {
        Logger.log('placeBulkOrder: missing seller email for sellerId=%s', sid);
      }
    }

    // Send single admin summary for all items
    sendOrderAllSummaryToAdmin(adminEmail, data.buyer_name, data.buyer_email, data.buyer_phone, items, grandTotal);

    return createResponse(true, 'Bulk orders placed', { orderCount: items.length, orderIds: orderIds });
  } catch (err) {
    Logger.log('placeBulkOrder error: ' + err);
    return createResponse(false, 'Failed to place bulk orders: ' + String(err));
  }
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

    // Send email to seller and include buyer contact as reply-to if available
    const mailOptions = {};
    if (buyerEmail) mailOptions.replyTo = buyerEmail;
    mailOptions.name = 'Dardyali';
    MailApp.sendEmail(sellerEmail, subject, body, mailOptions);
  } catch (error) {
    Logger.log('Error sending email to seller: ' + error);
  }
}

function sendOrderEmailToAdmin(adminEmail, sellerName, sellerEmail, sellerPhone, productName, buyerName, buyerEmail, buyerPhone, quantity, totalPrice, orderId) {
  try {
    const subject = `New Order Received #${orderId}`;
    const contactInfo = buyerEmail ? `Email: ${buyerEmail}` : `Phone: ${buyerPhone}`;
    const sellerContact = sellerEmail ? `Email: ${sellerEmail}` : `Phone: ${sellerPhone || 'N/A'}`;
    const body = `
      New order received on ForeignFinds Morocco!

      Order ID: ${orderId}
      Seller: ${sellerName}
      Seller Contact: ${sellerContact}
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

/**
 * Send a bulk email to a seller listing multiple items the buyer ordered from them.
 * items: [{ product_name, quantity, total_price, orderId }]
 */
function sendBulkEmailToSeller(sellerEmail, sellerName, items, buyerName, buyerEmail, buyerPhone) {
  try {
    const subject = `New Orders from ${buyerName || 'a buyer'}`;
    let itemLines = items.map(function(it) {
      return `${it.product_name} - Qty: ${it.quantity} - Total: ${it.total_price} DH (Order ID: ${it.orderId})`;
    }).join('\n');

    const contactInfo = buyerEmail ? `Email: ${buyerEmail}` : `Phone: ${buyerPhone || 'N/A'}`;
    const body = `
      Hi ${sellerName},

      You have received new orders from ${buyerName}.

      ${itemLines}

      Buyer Contact: ${contactInfo}

      Please follow up with the buyer to complete the transactions.

      Best regards,
      ForeignFinds Morocco Team
    `;

    const mailOptions = {};
    if (buyerEmail) mailOptions.replyTo = buyerEmail;
    mailOptions.name = 'Dardyali';
    MailApp.sendEmail(sellerEmail, subject, body, mailOptions);
  } catch (error) {
    Logger.log('Error sending bulk email to seller: ' + error);
  }
}

/**
 * Send a single admin summary for the entire "Order All" batch
 */
function sendOrderAllSummaryToAdmin(adminEmail, buyerName, buyerEmail, buyerPhone, items, grandTotal) {
  try {
    const subject = `New Bulk Order from ${buyerName || 'a buyer'}`;
    let itemLines = items.map(function(it) {
      return `${it.product_name} (Seller: ${it.seller_name} | Email: ${it.seller_email || 'N/A'} | Phone: ${it.seller_phone || 'N/A'}) - Qty: ${it.quantity} - Total: ${it.total_price} DH`;
    }).join('\n');

    const contactInfo = buyerEmail ? `Email: ${buyerEmail}` : `Phone: ${buyerPhone || 'N/A'}`;
    const body = `
      New bulk order received on ForeignFinds Morocco!

      Buyer Name: ${buyerName}
      Buyer Contact: ${contactInfo}

      Items:
      ${itemLines}

      Grand Total: ${grandTotal} DH

      Please review the Orders sheet for details and ensure sellers are notified.

      Best regards,
      ForeignFinds Morocco System
    `;

    MailApp.sendEmail(adminEmail, subject, body);
  } catch (error) {
    Logger.log('Error sending admin bulk summary: ' + error);
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
// DAILY TRAFFIC TRACKING
// ============================================================================

function trackDailyVisitor(data, ss) {
  // Get or create daily traffic sheet
  let trafficSheet = ss.getSheetByName('daily traffic use sheet');
  if (!trafficSheet) {
    trafficSheet = ss.insertSheet('daily traffic use sheet');
    const headers = ['visitor_id', 'visit_date', 'visit_timestamp', 'browser_user_agent', 'referrer', 'language', 'recorded_at'];
    trafficSheet.appendRow(headers);
  }

  // Record visitor info
  const recordedAt = new Date().toISOString();
  trafficSheet.appendRow([
    data.visitor_id || 'unknown',
    data.visit_date || new Date().toLocaleDateString('en-CA'),
    data.visit_timestamp || new Date().toISOString(),
    data.browser_user_agent || 'Unknown',
    data.referrer || 'Direct',
    data.language || 'Unknown',
    recordedAt
  ]);

  return createResponse(true, 'Visitor tracked successfully');
}

function getTodayVisitorCount(date, ss) {
  try {
    const trafficSheet = ss.getSheetByName('daily traffic use sheet');
    if (!trafficSheet) {
      return createResponse(true, 'No visitor data yet', { count: 0 });
    }

    const sheetData = trafficSheet.getDataRange().getValues();
    const uniqueVisitors = new Set();

    // Sheet columns: [visitor_id, visit_date, visit_timestamp, ...]
    for (let i = 1; i < sheetData.length; i++) {
      const rowDate = String(sheetData[i][1] || '');
      const rowVisitorId = String(sheetData[i][0] || '');
      if (rowDate === date && rowVisitorId) {
        uniqueVisitors.add(rowVisitorId);
      }
    }

    return createResponse(true, 'Visitor count retrieved', { count: uniqueVisitors.size });
  } catch (err) {
    Logger.log('getTodayVisitorCount error: ' + err);
    return createResponse(false, 'Error retrieving visitor count: ' + String(err));
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Internal helper to lookup a seller email from the Sellers sheet by sellerId or sellerName.
 * Returns empty string if not found.
 */
function getSellerEmailInternal(sellerId, sellerName, ss) {
  try {
    const sellersSheet = ss.getSheetByName('Sellers');
    if (!sellersSheet) return '';
    const data = sellersSheet.getDataRange().getValues();

    // Try to detect an email column from headers (e.g., 'email' or 'seller_email')
    const headerRow = data[0] || [];
    let emailCol = -1;
    for (let c = 0; c < headerRow.length; c++) {
      const h = String(headerRow[c] || '').toLowerCase();
      if (h.includes('email')) { emailCol = c; break; }
    }

    // Fallback email regex to scan rows if header detection fails
    const emailRegex = /\S+@\S+\.\S+/;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowId = String(row[0] || '');
      const rowName = String(row[1] || '');
      let rowEmail = '';

      if (emailCol >= 0) {
        rowEmail = String(row[emailCol] || '');
      } else {
        // scan entire row for first email-like value
        for (let c = 0; c < row.length; c++) {
          const cell = String(row[c] || '');
          if (emailRegex.test(cell)) { rowEmail = cell; break; }
        }
      }

      if (sellerId && String(sellerId) === rowId && rowEmail) return rowEmail;
      if (sellerName && rowName && rowName.toLowerCase() === String(sellerName).toLowerCase() && rowEmail) return rowEmail;
    }
    return '';
  } catch (err) {
    Logger.log('getSellerEmailInternal error: ' + err);
    return '';
  }
}

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

