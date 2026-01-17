import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { verifySeller } from "@/services/sellerApi";

interface SellerLoginProps {
  onLoginSuccess: (sellerId: string) => void;
}

export const SellerLogin = ({ onLoginSuccess }: SellerLoginProps) => {
  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!sellerId.trim()) {
      setError("Please enter your Seller ID");
      setLoading(false);
      return;
    }

    try {
      const result = await verifySeller(sellerId);
      if (result.success) {
        onLoginSuccess(sellerId);
      } else {
        setError("Seller ID not found. Please check and try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Seller Login</CardTitle>
        <CardDescription>
          Enter your Seller ID to access your dashboard and manage products
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

          <div className="space-y-2">
            <Label htmlFor="sellerId">Seller ID</Label>
            <Input
              id="sellerId"
              type="text"
              placeholder="e.g., AB1C2D3E"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500">
              Lost your ID? Contact support or register as a new seller
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
