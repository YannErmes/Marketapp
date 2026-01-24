const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";

export interface SellerData {
  sellerId: string;
  seller_name: string;
  seller_email: string;
  seller_whatsapp: string;
  seller_location: string;
  seller_image?: string;
}

export interface SellerProduct {
  id: string;
  product_name: string;
  product_image_url: string;
  price: number;
  salesCount: number;
}

// Verify seller login
export const verifySeller = async (sellerId: string): Promise<{
  success: boolean;
  message: string;
  seller_name?: string;
  seller_email?: string;
  seller_whatsapp?: string;
  seller_location?: string;
  seller_image?: string;
}> => {
  const url = `${APPS_SCRIPT_URL}?action=verify_seller&sellerId=${encodeURIComponent(sellerId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to verify seller: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

// Register new seller
export const registerSeller = async (sellerData: Omit<SellerData, "sellerId">): Promise<{
  success: boolean;
  message: string;
  sellerId?: string;
}> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "register_seller",
      ...sellerData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to register seller: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Send notification email to admin with seller data
  if (result.success && result.sellerId) {
    try {
      await notifyAdminOfSellerRegistration(sellerData, result.sellerId);
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      // Don't throw - registration still succeeded
    }
  }
  
  return result;
};

// Submit a seller request (stores seller data with empty sellerId and not assign an ID)
export const submitSellerRequest = async (sellerData: Omit<SellerData, "sellerId">): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "submit_seller_request",
      ...sellerData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit seller request: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};

// Notify admin of new seller registration
export const notifyAdminOfSellerRegistration = async (sellerData: any, sellerId: string): Promise<void> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "notify_seller_registration",
      sellerData: sellerData,
      sellerId: sellerId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send notification: ${response.statusText}`);
  }
};

// Get seller info
export const getSellerInfo = async (sellerId: string): Promise<SellerData | null> => {
  const url = `${APPS_SCRIPT_URL}?action=get_seller_info&sellerId=${encodeURIComponent(sellerId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    if (result.success) {
      return result as SellerData;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Get seller email by seller name
export const getSellerEmailByName = async (sellerName: string): Promise<string | null> => {
  const url = `${APPS_SCRIPT_URL}?action=get_seller_email_by_name&seller_name=${encodeURIComponent(sellerName)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    if (result.success && result.seller_email) {
      return result.seller_email;
    }
    return null;
  } catch (error) {
    console.error("Failed to get seller email:", error);
    return null;
  }
};

// Get seller's products
export const getSellerProducts = async (sellerId: string): Promise<SellerProduct[]> => {
  const url = `${APPS_SCRIPT_URL}?action=get_seller_products&sellerId=${encodeURIComponent(sellerId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    if (result.success && result.products) {
      return result.products;
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Edit product
export const editProduct = async (sellerId: string, productData: any): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "edit_product",
      sellerId: sellerId,
      ...productData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to edit product: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};

// Delete product
export const deleteProduct = async (sellerId: string, productId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "delete_product",
      sellerId: sellerId,
      productId: productId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};

// Place order (for customer checkout)
export const placeOrder = async (orderData: {
  productId: string;
  sellerId: string;
  seller_email: string;
  seller_phone?: string;
  seller_name: string;
  product_name: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  quantity: number;
  total_price: number;
}): Promise<{
  success: boolean;
  message: string;
  orderId?: string;
}> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "place_order",
      ...orderData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to place order: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};

// Place multiple orders in a single request (used by "Order All")
export const placeBulkOrder = async (payload: {
  buyer_name: string;
  buyer_email?: string;
  buyer_phone?: string;
  items: Array<{
    productId: string;
    sellerId: string;
    seller_email?: string;
    seller_phone?: string;
    seller_name?: string;
    product_name?: string;
    quantity: number;
    total_price: number;
  }>;
}): Promise<{ success: boolean; message: string; orderCount?: number; orderIds?: string[] }> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error("VITE_APPS_SCRIPT_URL is not configured");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "place_bulk_order",
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to place bulk orders: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};

// Store seller ID in localStorage
export const setSellerSession = (sellerId: string): void => {
  localStorage.setItem("sellerId", sellerId);
};

// Get seller ID from localStorage
export const getSellerSession = (): string | null => {
  return localStorage.getItem("sellerId");
};

// Clear seller session
export const clearSellerSession = (): void => {
  localStorage.removeItem("sellerId");
};
