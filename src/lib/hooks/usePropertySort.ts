import { useState, useMemo } from "react";

export type SortOption =
  | "default"
  | "price-desc"
  | "price-asc"
  | "newest"
  | "beds-desc"
  | "baths-desc"
  | "year-desc"
  | "sqft-desc";

export type Property = {
  id: string;
  price: string | number;
  beds: number;
  baths: number;
  sqft: number;
  title?: string;
  location?: string;
  image?: string;
  status?: "For Sale" | "For Rent" | "Sold" | "Pending";
  // Add other property fields as needed
};

// Helper function to normalize price values
const normalizePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  return parseInt(price.replace(/[^0-9]/g, "")) || 0;
};

export const usePropertySort = (properties: Property[]) => {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedProperties = useMemo(() => {
    const propertyList = [...properties];

    switch (sortBy) {
      case "price-desc":
        return propertyList.sort((a, b) => {
          return normalizePrice(b.price) - normalizePrice(a.price);
        });
      case "price-asc":
        return propertyList.sort((a, b) => {
          return normalizePrice(a.price) - normalizePrice(b.price);
        });
      case "beds-desc":
        return propertyList.sort((a, b) => b.beds - a.beds);
      case "baths-desc":
        return propertyList.sort((a, b) => b.baths - a.baths);
      case "sqft-desc":
        return propertyList.sort((a, b) => b.sqft - a.sqft);
      default:
        return propertyList;
    }
  }, [properties, sortBy]);

  return { sortedProperties, sortBy, setSortBy };
};
