import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome message before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup");

    if (!hasSeenWelcome) {
      // Show popup after 10 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Mark that user has seen the popup
        localStorage.setItem("hasSeenWelcomePopup", "true");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-4 py-6">
          <h2 className="text-2xl font-bold">Thank You! 🙏</h2>
          <p className="text-gray-600">
            Welcome to Dardyali. We're glad you're here!
          </p>
          <Button onClick={handleClose} className="w-full">
            Thanks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
