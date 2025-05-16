import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOptionItem = {
  label: string;
  value: string;
};

import { SortOption } from "@/lib/hooks/usePropertySort";

interface SortDropdownProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export const sortOptions: SortOptionItem[] = [
  { label: "Default", value: "default" },
  { label: "Price - High to Low", value: "price-desc" },
  { label: "Price - Low to High", value: "price-asc" },
  { label: "Newest Listings", value: "newest" },
  { label: "Beds (Most)", value: "beds-desc" },
  { label: "Baths (Most)", value: "baths-desc" },
  { label: "Year Built (Newest)", value: "year-desc" },
  { label: "Square Feet (Biggest)", value: "sqft-desc" },
];

const SortDropdown = ({ value, onValueChange }: SortDropdownProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] bg-transparent border-0 text-sm text-muted-foreground hover:text-primary transition-colors">
        <SelectValue placeholder="Sort by: Default" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortDropdown;
