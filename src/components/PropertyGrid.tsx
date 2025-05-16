import { useState } from "react";
import PropertyCard from "./PropertyCard";
import { mockListings, formatPrice } from "@/lib/data/mockListings";
import SortDropdown from "./ui/sort-dropdown";
import { usePropertySort, Property } from "@/lib/hooks/usePropertySort";

const PropertyGrid = () => {
  const { sortedProperties, sortBy, setSortBy } = usePropertySort(
    mockListings as unknown as Property[],
  );

  return (
    <div className="flex-1 container py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Properties</h2>
        <SortDropdown value={sortBy} onValueChange={setSortBy} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProperties.map((listing) => (
          <PropertyCard
            key={listing.id}
            id={listing.id}
            title={listing.title || ""}
            price={formatPrice(
              typeof listing.price === "string"
                ? parseInt(listing.price.replace(/[^0-9]/g, "")) || 0
                : listing.price,
            )}
            location={listing.location || ""}
            beds={listing.beds}
            baths={listing.baths}
            sqft={listing.sqft}
            image={listing.image || ""}
            status={listing.status || "For Sale"}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
