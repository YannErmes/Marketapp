import { useEffect, useState } from "react";
import { SellerSetup } from "@/components/SellerSetup";
import { AddProduct } from "@/components/AddProduct";
import { getStoredSellerInfo, SellerInfo } from "@/services/addProductApi";

export default function SubmitProduct() {
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredSellerInfo();
    setSellerInfo(stored);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Submit Your Products</h1>
        <p className="text-center text-gray-600 mb-8">
          {sellerInfo
            ? "Add a new product to your inventory"
            : "Set up your seller profile to get started"}
        </p>

        {!sellerInfo ? (
          <SellerSetup onSellerInfoSaved={(info) => setSellerInfo(info)} />
        ) : (
          <AddProduct
            sellerInfo={sellerInfo}
            onClearSeller={() => setSellerInfo(null)}
            onProductSubmitted={() => {
              // Optional: show success message or redirect
              console.log("Product submitted successfully");
            }}
          />
        )}
      </div>
    </div>
  );
}
