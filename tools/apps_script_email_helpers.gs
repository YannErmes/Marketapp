/*
  Apps Script helpers: updated email sending and robust seller email lookup.
  Paste these functions into your deployed Apps Script project (replace existing implementations), save and redeploy.
*/

function sendOrderEmailToSeller(sellerEmail, sellerName, productName, buyerName, buyerEmail, buyerPhone, quantity, totalPrice, orderId) {
  try {
    const subject = `New Order #${orderId}`;
    const contactInfo = buyerEmail ? `Email: ${buyerEmail}` : `Phone: ${buyerPhone}`;
    const body = `\nHi ${sellerName},\n\nYou have received a new order!\n\nOrder ID: ${orderId}\nProduct: ${productName}\nBuyer Name: ${buyerName}\nBuyer ${contactInfo}\nQuantity: ${quantity}\nTotal Price: ${totalPrice} DH\n\nPlease follow up with the buyer to complete the transaction.\n\nBest regards,\nDardyali\n`;

    // Use mail options: include buyer as reply-to when available and a friendly sender name
    const mailOptions = {};
    if (buyerEmail) mailOptions.replyTo = buyerEmail;
    mailOptions.name = 'Dardyali';

    MailApp.sendEmail(sellerEmail, subject, body, mailOptions);
  } catch (error) {
    Logger.log('Error sending email to seller: ' + error);
  }
}

function sendBulkEmailToSeller(sellerEmail, sellerName, items, buyerName, buyerEmail, buyerPhone) {
  try {
    const subject = `New Orders from ${buyerName || 'a buyer'}`;
    let itemLines = items.map(function(it) {
      return `${it.product_name} - Qty: ${it.quantity} - Total: ${it.total_price} DH (Order ID: ${it.orderId})`;
    }).join('\n');

    const contactInfo = buyerEmail ? `Email: ${buyerEmail}` : `Phone: ${buyerPhone || 'N/A'}`;
    const body = `\nHi ${sellerName},\n\nYou have received new orders from ${buyerName}.\n\n${itemLines}\n\nBuyer Contact: ${contactInfo}\n\nPlease follow up with the buyer to complete the transactions.\n\nBest regards,\nDardyali\n`;

    const mailOptions = {};
    if (buyerEmail) mailOptions.replyTo = buyerEmail;
    mailOptions.name = 'Dardyali';
    MailApp.sendEmail(sellerEmail, subject, body, mailOptions);
  } catch (error) {
    Logger.log('Error sending bulk email to seller: ' + error);
  }
}

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
