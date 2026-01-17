import { useEffect, useState } from "react";
import { SellerLogin } from "@/components/SellerLogin";
import { SellerDashboard } from "@/components/SellerDashboard";
import { SellerSetup } from "@/components/SellerSetup";
import { SellerRegisterRequest } from "@/components/SellerRegisterRequest";
import { getSellerInfo, getSellerSession, setSellerSession, SellerData } from "@/services/sellerApi";

type PortalStep = "request" | "login" | "setup" | "dashboard";

export default function SellerPortal() {
  const [step, setStep] = useState<PortalStep>("request");
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if seller is already logged in
    const sessionId = getSellerSession();
    if (sessionId) {
      setSellerId(sessionId);
      loadSellerInfo(sessionId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadSellerInfo = async (id: string) => {
    try {
      const info = await getSellerInfo(id);
      if (info) {
        setSellerInfo(info);
        setStep("dashboard");
      } else {
        setStep("login");
      }
    } catch (error) {
      console.error("Failed to load seller info:", error);
      setStep("login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (id: string) => {
    setSellerId(id);
    setSellerSession(id);
    const info = await getSellerInfo(id);
    if (info) {
      setSellerInfo(info);
      setStep("dashboard");
    } else {
      setStep("setup");
    }
  };

  const handleRegisterRequest = () => {
    setStep("setup");
  };

  const handleSetupComplete = (info: SellerData) => {
    setSellerInfo(info);
    setStep("dashboard");
  };

  const handleRegistrationComplete = (sellerId: string) => {
    setSellerId(sellerId);
    setSellerSession(sellerId);
    // Auto-navigate to login screen so they can login with their new ID
    setStep("login");
  };

  const handleLogout = () => {
    setSellerId(null);
    setSellerInfo(null);
    setStep("login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {step === "request" && (
        <SellerRegisterRequest
          onRequestSubmit={handleRegisterRequest}
          onLoginClick={() => setStep("login")}
        />
      )}

      {step === "login" && <SellerLogin onLoginSuccess={handleLoginSuccess} />}

      {step === "setup" && (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">Complete Your Profile</h1>
            <p className="text-center text-gray-600 mb-8">
              You're almost there! Let's set up your seller profile.
            </p>
            <SellerSetup
              onSellerInfoSaved={(info) =>
                handleSetupComplete({
                  sellerId: sellerId,
                  ...info,
                })
              }
              onRegistrationComplete={handleRegistrationComplete}
              submitAsRequest={true}
            />
          </div>
        </div>
      )}

      {step === "dashboard" && sellerId && sellerInfo && (
        <SellerDashboard
          sellerId={sellerId}
          sellerInfo={sellerInfo}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
