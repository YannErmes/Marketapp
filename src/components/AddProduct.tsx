import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  submitProductToSheet,
  ProductFormData,
  SellerInfo,
  clearSellerInfo,
} from "@/services/addProductApi";
import { useQueryClient } from '@tanstack/react-query';

interface AddProductProps {
  sellerInfo: SellerInfo;
  onProductSubmitted?: () => void;
  onClearSeller?: () => void;
}

export const AddProduct = ({ sellerInfo, onProductSubmitted, onClearSeller }: AddProductProps) => {
  const [formData, setFormData] = useState({
    product_name: "",
    product_image_url: "",
    image_1: "",
    image_2: "",
    image_3: "",
    description: "",
    price: "",
    rating: "",
    category: "",
    location_google_maps_link: "",
    isBestSeller: false,
    salesCount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleImageChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required product fields
    if (!formData.product_name || !formData.product_image_url || !formData.description || !formData.price) {
      setError("Product name, image, description, and price are required");
      setLoading(false);
      return;
    }

    try {
      const fullData: ProductFormData = {
        ...sellerInfo,
        ...formData,
        price: Number(formData.price) || 0,
        rating: Number(formData.rating) || 0,
        salesCount: Number(formData.salesCount) || 0,
      };

      const result = await submitProductToSheet(fullData);

      if (result.success) {
        setSuccess(true);
        setFormData({
          product_name: "",
          product_image_url: "",
          image_1: "",
          image_2: "",
          image_3: "",
          description: "",
          price: "",
          rating: "",
          category: "",
          location_google_maps_link: "",
          isBestSeller: false,
          salesCount: "",
        });

        // Invalidate products cache so marketplace updates (or we could append to cache)
        try {
          const qc = useQueryClient();
          qc.invalidateQueries({ queryKey: ["products"] });
        } catch (e) {
          // ignore
        }

        setTimeout(() => {
          setSuccess(false);
          onProductSubmitted?.();
        }, 2000);
      } else {
        setError(result.message || "Failed to submit product");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Seller Info Display */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Seller Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">{sellerInfo.seller_name}</span>
            <span className="text-gray-600 ml-2">({sellerInfo.seller_email})</span>
          </div>
          <div className="text-gray-600">
            {sellerInfo.seller_location} • {sellerInfo.seller_whatsapp}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              clearSellerInfo();
              onClearSeller?.();
            }}
            className="text-xs"
          >
            Change Seller Profile
          </Button>
        </CardContent>
      </Card>

      {/* Product Form */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Fill in the product details below. Images can be uploaded or linked via URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Product added successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name *</Label>
              <Input
                id="product_name"
                name="product_name"
                type="text"
                placeholder="e.g., Handcrafted Ceramic Vase"
                value={formData.product_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Main Product Image */}
            <div className="space-y-2">
              <Label htmlFor="product_image_url">Main Product Image *</Label>
              <div className="flex gap-2">
                <Input
                  id="product_image_url"
                  name="product_image_url"
                  type="text"
                  placeholder="Image URL or upload below"
                  value={formData.product_image_url}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex-1"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange("product_image_url", e)}
                  disabled={loading}
                  className="flex-1"
                />
              </div>
              {formData.product_image_url && (
                <img
                  src={formData.product_image_url}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded mt-2"
                />
              )}
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-3 gap-2">
              {(["image_1", "image_2", "image_3"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>Additional Image {field.split("_")[1]}</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id={field}
                      name={field}
                      type="text"
                      placeholder="URL"
                      value={formData[field]}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-xs"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(field, e)}
                      disabled={loading}
                      className="text-xs"
                    />
                  </div>
                  {formData[field] && (
                    <img
                      src={formData[field]}
                      alt={field}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={4}
                required
              />
            </div>

            {/* Price & Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (DH) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={loading}
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  placeholder="4.5"
                  value={formData.rating}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>

            {/* Category & Maps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g., Handicrafts"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_google_maps_link">Google Maps Link</Label>
                <Input
                  id="location_google_maps_link"
                  name="location_google_maps_link"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formData.location_google_maps_link}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Best Seller & Sales Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  id="isBestSeller"
                  name="isBestSeller"
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4"
                />
                <Label htmlFor="isBestSeller" className="cursor-pointer">
                  Mark as Best Seller
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesCount">Sales Count</Label>
                <Input
                  id="salesCount"
                  name="salesCount"
                  type="number"
                  placeholder="0"
                  value={formData.salesCount}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
