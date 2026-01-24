const API_URL = (import.meta.env && import.meta.env.VITE_APPS_SCRIPT_URL) || "https://script.google.com/macros/s/AKfycbyXoc4rYMlSl5SRAlBLhrKl-ZF6qVwvIeBNu1CNOPZwjPEhgVhmqULQY2iJGaDfeMRbLA/exec";

// If you want the app to pull directly from a Google Sheet, set VITE_SHEET_ID in your
// environment (.env) to the spreadsheet ID. The code will then fetch the GViz JSON
// endpoint and parse rows into product objects. Otherwise it falls back to the Apps Script API above.
const SHEET_ID = (import.meta.env && import.meta.env.VITE_SHEET_ID) || "";

// Fetch GViz JSON from a public Google Sheet and parse into an array of records.
const fetchSheetAsJson = async (sheetId: string, sheetName?: string) => {
  const sheetParam = sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : "";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${sheetParam}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.statusText}`);
  const text = await res.text();

  // The response is not pure JSON. It looks like: "/*O_o*/\ngoogle.visualization.Query.setResponse({...});"
  let jsonText = text;
  
  // Remove the GViz wrapper comments and function call
  if (jsonText.includes('setResponse')) {
    jsonText = jsonText.replace(/^[\s\S]*?setResponse\(/, '').replace(/\);[\s\S]*$/, '');
  } else if (jsonText.includes('/*O_o*/')) {
    // Alternative format - just remove the comment wrapper
    jsonText = jsonText.replace(/^\/\*O_o\*\//, '').trim();
  }
  
  const payload = JSON.parse(jsonText);

  const cols = (payload.table.cols || []).map((c: any) => (c && (c.label || c.id)) || "");
  const rows = payload.table.rows || [];

  return rows.map((r: any) => {
    const obj: Record<string, any> = {};
    (r.c || []).forEach((cell: any, idx: number) => {
      const key = cols[idx] || `col_${idx}`;
      obj[key] = cell ? cell.v : "";
    });
    return obj;
  });
};

export interface ApiProduct {
  id: string;
  product_name: string;
  product_image_url: string;
  seller_email?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  seller_name: string;
  seller_image?: string;
  seller_whatsapp: string;
  seller_location?: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  location_google_maps_link?: string;
  isBestSeller?: boolean;
  salesCount?: number;
}

export interface Product {
  id: string;
  product_name: string;
  product_image_url: string;
  seller_email?: string;
  seller_name: string;
  seller_image?: string;
  seller_whatsapp: string;
  seller_location?: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  location_google_maps_link: string;
  additional_images: string[];
  isBestSeller?: boolean;
  salesCount?: number;
}

export interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
  total_products: number;
  total_price: number;
  message?: string;
}

// Transform API product to app product format
const transformProduct = (apiProduct: ApiProduct): Product => {
  const additionalImages: string[] = [];
  
  if (apiProduct.image_1) additionalImages.push(apiProduct.image_1);
  if (apiProduct.image_2) additionalImages.push(apiProduct.image_2);
  if (apiProduct.image_3) additionalImages.push(apiProduct.image_3);
  
  // If no additional images, use main image
  if (additionalImages.length === 0 && apiProduct.product_image_url) {
    additionalImages.push(apiProduct.product_image_url);
  }

  return {
    id: apiProduct.id || String(Math.random()),
    product_name: apiProduct.product_name || "Unknown Product",
    product_image_url: apiProduct.product_image_url || apiProduct.image_1 || "",
    seller_email: apiProduct.seller_email || '',
    seller_name: apiProduct.seller_name || "Unknown Seller",
    seller_image: apiProduct.seller_image,
    seller_whatsapp: apiProduct.seller_whatsapp || "",
    seller_location: apiProduct.seller_location,
    description: apiProduct.description || "",
    price: Number(apiProduct.price) || 0,
    rating: Number(apiProduct.rating) || 0,
    category: apiProduct.category || "Other",
    location_google_maps_link: apiProduct.location_google_maps_link || "",
    additional_images: additionalImages,
    isBestSeller: apiProduct.isBestSeller,
    salesCount: apiProduct.salesCount,
  };
};

export const fetchProducts = async (sellerName?: string): Promise<{
  products: Product[];
  totalProducts: number;
  totalPrice: number;
}> => {
  // If a sheet ID is supplied via Vite env, fetch directly from that sheet.
  if (SHEET_ID) {
    const rows = await fetchSheetAsJson(SHEET_ID);

    // Map sheet rows (which use column headers) to the ApiProduct shape expected by transformProduct.
    const apiProducts: ApiProduct[] = rows.map((r: any) => ({
      id: String(r.id || r.ID || r.Id || Math.random()),
      product_name: r.product_name || r.product || r.title || "",
      product_image_url: r.product_image_url || r.product_image || r.image || r.image_1 || "",
      image_1: r.image_1 || r.image1 || "",
      image_2: r.image_2 || r.image2 || "",
      image_3: r.image_3 || r.image3 || "",
      seller_name: r.seller_name || r.seller || "",
      seller_image: r.seller_image || r.sellerImage || "",
      seller_whatsapp: r.seller_whatsapp || r.seller_whatsapp_number || r.seller_whatsapp_number || "",
      seller_location: r.seller_location || r.seller_location || "",
      description: r.description || r.desc || "",
      price: Number(r.price || 0) || 0,
      rating: Number(r.rating || 0) || 0,
      category: r.category || "Other",
      location_google_maps_link: r.location_google_maps_link || r.location || "",
      isBestSeller: r.isBestSeller === "TRUE" || r.isBestSeller === true || r.isBestSeller === "true",
      salesCount: Number(r.salesCount || r.sales_count || 0) || 0,
    }));

    // Optionally filter by seller
    const filtered = sellerName
      ? apiProducts.filter((p) => (p.seller_name || "").toLowerCase() === sellerName.toLowerCase())
      : apiProducts;

    const products = filtered.map(transformProduct);

    return {
      products,
      totalProducts: products.length,
      totalPrice: products.reduce((sum, p) => sum + p.price, 0),
    };
  }

  // Fallback: call existing API_URL (Apps Script endpoint)
  let url = API_URL;
  if (sellerName) {
    url += `?seller=${encodeURIComponent(sellerName)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: ApiResponse = await response.json();
  if (!data.success && data.message) {
    throw new Error(data.message);
  }

  const products = (data.data || []).map(transformProduct);

  return {
    products,
    totalProducts: data.total_products || products.length,
    totalPrice: data.total_price || products.reduce((sum, p) => sum + p.price, 0),
  };
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    // Fetch directly from Apps Script to get full product data from the sheet
    const url = `${API_URL}?action=get_product_by_id&productId=${encodeURIComponent(id)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.id) {
      return transformProduct(result as ApiProduct);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    // Fallback to fetching all products and searching (for offline/error scenarios)
    try {
      const { products } = await fetchProducts();
      return products.find((p) => p.id === id) || null;
    } catch {
      return null;
    }
  }
};

// Extract unique categories from products
export const getCategories = (products: Product[]): string[] => {
  const categories = new Set(products.map((p) => p.category));
  return ["All Categories", ...Array.from(categories)];
};

// Extract unique sellers from products
export const getSellers = (products: Product[]): string[] => {
  return Array.from(new Set(products.map((p) => p.seller_name)));
};




