import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  selectedSeller: string;
  sortBy: string;
  onCategoryChange: (value: string) => void;
  onSellerChange: (value: string) => void;
  onSortChange: (value: string) => void;
  sellers: string[];
  categories?: string[];
}

const defaultCategories = [
  "All Categories",
  "Food & Snacks",
  "Beverages",
  "Spices & Seasonings",
  "Personal Care",
  "Cultural Products",
  "Home Essentials",
  "Books & Media",
];

const FilterBar = ({
  selectedCategory,
  selectedSeller,
  sortBy,
  onCategoryChange,
  onSellerChange,
  onSortChange,
  categories = defaultCategories,
}: FilterBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-card border rounded-lg p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('filter.category')}</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('filter.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('filter.seller')}</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('filter.searchSeller')}
              value={selectedSeller === "All Sellers" ? "" : selectedSeller}
              onChange={(e) => onSellerChange(e.target.value || "All Sellers")}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('filter.sortBy')}</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('filter.trending')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">{t('filter.trending')}</SelectItem>
              <SelectItem value="rating">{t('filter.highestRated')}</SelectItem>
              <SelectItem value="price-low">{t('filter.priceLowHigh')}</SelectItem>
              <SelectItem value="price-high">{t('filter.priceHighLow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
