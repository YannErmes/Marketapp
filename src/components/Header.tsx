import { ShoppingCart, Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import cartService from "@/services/cart";

interface HeaderProps {
  cartCount?: number;
}

const Header = ({ cartCount = 0 }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [count, setCount] = useState<number>(cartCount);
  const { t } = useTranslation();

  // Initialize and listen for cart updates
  useEffect(() => {
    setCount(cartService.getCart().reduce((s, i) => s + (i.quantity || 0), 0));
    const handler = (e: any) => {
      const c = (e?.detail?.count !== undefined) ? e.detail.count : cartService.getCart().reduce((s, i) => s + (i.quantity || 0), 0);
      setCount(c);
    };
    window.addEventListener('cartUpdated', handler as EventListener);
    return () => window.removeEventListener('cartUpdated', handler as EventListener);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl tracking-tight">
            Foreign Market <span className="text-muted-foreground">Morocco</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            {t('header.home')}
          </Link>
          <Link to="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
            {t('header.marketplace')}
          </Link>
          <Link to="/seller-portal">
            <Button variant="ghost" size="sm" className="text-xs">
              Seller
            </Button>
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('header.searchProducts')}
              className="pl-10"
            />
          </div>
        </div>

        {/* Cart, Language & Mobile Menu */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {count}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-3">
            <Link
              to="/"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.home')}
            </Link>
            <Link
              to="/marketplace"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.marketplace')}
            </Link>
            <Link
              to="/seller-portal"
              className="block"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button variant="ghost" size="sm" className="text-xs w-full justify-start">
                Seller Portal
              </Button>
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('header.searchProducts')}
                className="pl-10"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
