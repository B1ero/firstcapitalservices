import Header from "./Header";
import { mockListings, formatPrice } from "@/lib/data/mockListings";
import PropertyCard from "./PropertyCard";
import SortDropdown from "./ui/sort-dropdown";
import { usePropertySort, Property } from "@/lib/hooks/usePropertySort";

const ListingsPage = () => {
  const { sortedProperties, sortBy, setSortBy } = usePropertySort(
    mockListings as unknown as Property[],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Listings</h1>
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
    </div>
  );
};

export default ListingsPage;
