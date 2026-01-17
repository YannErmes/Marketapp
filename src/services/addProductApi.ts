// Replace VITE_APPS_SCRIPT_URL with your deployed Apps Script endpoint
// See the deployment instructions for how to create and deploy the Apps Script
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";

export interface SellerInfo {
  sellerId?: string;
  seller_name: string;
  seller_email: string;
  seller_whatsapp: string;
  seller_location: string;
  seller_image: string;
}

export interface ProductFormData extends SellerInfo {
  product_name: string;
  product_image_url: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  location_google_maps_link?: string;
  isBestSeller?: boolean;
  salesCount?: number;
}

export const submitProductToSheet = async (formData: ProductFormData): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      "VITE_APPS_SCRIPT_URL is not configured. Please set it in your .env file with your deployed Apps Script URL."
    );
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({ action: 'add_product', ...formData }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit product: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    success: result.success || false,
    message: result.message || "Product submitted successfully",
  };
};

// Seller info is stored in localStorage for quick subsequent visits
export const getStoredSellerInfo = (): SellerInfo | null => {
  const stored = localStorage.getItem("sellerInfo");
  return stored ? JSON.parse(stored) : null;
};

export const saveSellerInfo = (info: SellerInfo): void => {
  localStorage.setItem("sellerInfo", JSON.stringify(info));
};

export const clearSellerInfo = (): void => {
  localStorage.removeItem("sellerInfo");
};
