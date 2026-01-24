import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Dardyali</h3>
            <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('header.marketplace')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.cookies')}</Link></li>
              <li><Link to="/note" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.note')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.followUs')}</h4>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dardyali. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
