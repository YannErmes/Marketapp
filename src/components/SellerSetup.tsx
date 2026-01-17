import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { registerSeller, submitSellerRequest } from "@/services/sellerApi";

interface SellerSetupProps {
  onSellerInfoSaved: (info: any) => void;
  onRegistrationComplete?: (sellerId: string) => void;
  submitAsRequest?: boolean; // when true, submit as a request (no generated ID)
}

export const SellerSetup = ({ onSellerInfoSaved, onRegistrationComplete, submitAsRequest = false }: SellerSetupProps) => {
  const [formData, setFormData] = useState({
    seller_name: "",
    seller_email: "",
    seller_whatsapp: "",
    seller_location: "",
    seller_image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          seller_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (
      !formData.seller_name ||
      !formData.seller_email ||
      !formData.seller_whatsapp ||
      !formData.seller_location
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const registerSellerAsync = async () => {
      try {
        if (submitAsRequest) {
          // Submit as a request: store data in Sellers sheet with empty sellerId and notify admin
          const result = await submitSellerRequest(formData);
          if (result.success) {
            setSuccess(true);
            setTimeout(() => {
              onSellerInfoSaved({ ...formData });
              if (onRegistrationComplete) {
                onRegistrationComplete('');
              }
            }, 2000);
          } else {
            setError(result.message || 'Submission failed');
          }
        } else {
          const result = await registerSeller(formData);
          if (result.success && result.sellerId) {
            setGeneratedId(result.sellerId);
            setSuccess(true);
            setTimeout(() => {
              onSellerInfoSaved({ ...formData, sellerId: result.sellerId });
              // Auto-navigate to dashboard/login after showing ID
              if (onRegistrationComplete) {
                onRegistrationComplete(result.sellerId);
              }
            }, 2500);
          } else {
            setError(result.message || 'Registration failed');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    registerSellerAsync();
  };

  const copyToClipboard = () => {
    if (generatedId) {
      navigator.clipboard.writeText(generatedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Seller Registration</CardTitle>
        <CardDescription>
          Set up your seller profile. This information will be saved and associated with all your products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && generatedId ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Seller profile created successfully!
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-900">Your Seller ID</h3>
              <p className="text-sm text-blue-800">
                Save this ID securely. You'll need it to login to your seller dashboard.
              </p>
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-white border border-blue-300 rounded px-3 py-2 font-mono text-lg font-bold text-center">
                  {generatedId}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="border-blue-300 hover:bg-blue-100"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 font-medium">Copied to clipboard!</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Next step:</strong> You will be redirected to the login page. Use your ID to access your seller dashboard.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

          <div className="space-y-2">
            <Label htmlFor="seller_name">Seller Name *</Label>
            <Input
              id="seller_name"
              name="seller_name"
              type="text"
              placeholder="Your business or personal name"
              value={formData.seller_name}
              onChange={handleChange}
              disabled={loading || success}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller_email">Email *</Label>
            <Input
              id="seller_email"
              name="seller_email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.seller_email}
              onChange={handleChange}
              disabled={loading || success}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller_whatsapp">WhatsApp Number *</Label>
            <Input
              id="seller_whatsapp"
              name="seller_whatsapp"
              type="tel"
              placeholder="+212 6XX XXX XXX"
              value={formData.seller_whatsapp}
              onChange={handleChange}
              disabled={loading || success}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller_location">Location *</Label>
            <Input
              id="seller_location"
              name="seller_location"
              type="text"
              placeholder="City or region"
              value={formData.seller_location}
              onChange={handleChange}
              disabled={loading || success}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller_image">Seller Image (Optional)</Label>
            <Input
              id="seller_image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading || success}
            />
            {formData.seller_image && (
              <img
                src={formData.seller_image}
                alt="Preview"
                className="h-20 w-20 object-cover rounded mt-2"
              />
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || success}
            className="w-full"
          >
            {loading ? "Creating Account..." : success ? "Account Created!" : "Complete Registration"}
          </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
