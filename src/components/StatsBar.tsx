import { Package, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatsBarProps {
  totalProducts: number;
  totalPrice: number;
}

const StatsBar = ({ totalProducts, totalPrice }: StatsBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">
          {t('marketplace.totalProducts')}: <strong>{totalProducts}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">
          {t('marketplace.totalValue')}: <strong>{totalPrice.toLocaleString()} MAD</strong>
        </span>
      </div>
    </div>
  );
};

export default StatsBar;
