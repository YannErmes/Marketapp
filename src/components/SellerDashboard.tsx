import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Edit, Trash2, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getSellerProducts, deleteProduct, clearSellerSession, SellerProduct, SellerData } from "@/services/sellerApi";
import { saveSellerInfo } from "@/services/addProductApi";

interface SellerDashboardProps {
  sellerId: string;
  sellerInfo: SellerData;
  onLogout: () => void;
}

export const SellerDashboard = ({ sellerId, sellerInfo, onLogout }: SellerDashboardProps) => {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [sellerId]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsData = await getSellerProducts(sellerId);
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const result = await deleteProduct(sellerId, productId);
      if (result.success) {
        setDeleteSuccess(true);
        setProducts(products.filter((p) => p.id !== productId));
        setTimeout(() => setDeleteSuccess(false), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleLogout = () => {
    clearSellerSession();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome back, {sellerInfo.seller_name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Seller Info Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Seller ID</p>
                <p className="font-mono font-bold">{sellerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{sellerInfo.seller_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">WhatsApp</p>
                <p className="font-semibold">{sellerInfo.seller_whatsapp}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{sellerInfo.seller_location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Your Products</h2>
              <p className="text-gray-600">Total products: {products.length}</p>
            </div>
            <Button onClick={() => {
              saveSellerInfo({
                sellerId,
                seller_name: sellerInfo.seller_name,
                seller_email: sellerInfo.seller_email,
                seller_whatsapp: sellerInfo.seller_whatsapp,
                seller_location: sellerInfo.seller_location,
                seller_image: sellerInfo.seller_image || ''
              });
              navigate('/submit-product');
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {deleteSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Product deleted successfully!
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-gray-500">Loading products...</p>
              </CardContent>
            </Card>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">You haven't added any products yet.</p>
                  <Button onClick={() => {
                    saveSellerInfo({
                      sellerId,
                      seller_name: sellerInfo.seller_name,
                      seller_email: sellerInfo.seller_email,
                      seller_whatsapp: sellerInfo.seller_whatsapp,
                      seller_location: sellerInfo.seller_location,
                      seller_image: sellerInfo.seller_image || ''
                    });
                    navigate('/submit-product');
                  }}>Add Your First Product</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <div className="relative h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={product.product_image_url}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 pt-4 space-y-2">
                    <h3 className="font-semibold line-clamp-2">{product.product_name}</h3>
                    <p className="text-lg font-bold text-primary">{product.price} DH</p>
                    <p className="text-sm text-gray-600">Sales: {product.salesCount}</p>
                  </CardContent>
                  <div className="px-4 pb-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/seller/product/${product.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
