import { useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { WelcomePopup } from "./components/WelcomePopup";
import Shimmer from "./components/Shimmer";

const Home = lazy(() => import("./pages/Home"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));
const SubmitProduct = lazy(() => import("./pages/SubmitProduct"));
const SellerPortal = lazy(() => import("./pages/SellerPortal"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Note = lazy(() => import("./pages/Note"));
const Favorites = lazy(() => import("./pages/Favorites"));
import { trackDailyVisitor } from "./services/visitTracker";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Track visitor when app loads
    trackDailyVisitor();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <WelcomePopup />
            <Header cartCount={2} />
            <main className="flex-1">
              <Suspense fallback={<Shimmer className="w-full h-48" />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/seller/:sellerName" element={<SellerProfile />} />
                  <Route path="/submit-product" element={<SubmitProduct />} />
                  <Route path="/seller-portal" element={<SellerPortal />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/note" element={<Note />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
