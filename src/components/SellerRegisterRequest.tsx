import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SellerRegisterRequestProps {
  onRequestSubmit: () => void;
  onLoginClick: () => void;
}

export function SellerRegisterRequest({ onRequestSubmit, onLoginClick }: SellerRegisterRequestProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRegisterClick = async () => {
    // Instead of sending a preliminary notification, go to the setup form
    setIsLoading(true);
    setTimeout(() => {
      onRequestSubmit();
      setIsLoading(false);
    }, 300);
  };

  const handleCancel = () => {
    // User can go back or close
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
          <p className="text-gray-600">
            Join our marketplace and start selling your products
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Choose an option</strong>
            <br />
            If you're already a seller, login with your Seller ID. Otherwise, register as a new seller.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onLoginClick()}
            className="flex-1"
            disabled={isLoading}
          >
            I'm already a seller
          </Button>
          <Button
            onClick={handleRegisterClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Opening...' : 'Yes, Register Me'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default SellerRegisterRequest;
