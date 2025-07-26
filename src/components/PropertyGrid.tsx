import { useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { useListings, useListingsActions } from "@/lib/store/listings";
import type { CRMLSProperty } from "@/types/crmls";
import { Button } from "./ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

interface PropertyGridProps {
  className?: string;
}

// Helper function to format price as US currency
const formatCurrency = (price: number | undefined): string => {
  if (!price) return "Price Available Upon Request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function to format square footage
const formatSquareFootage = (sqft: number | undefined): number => {
  return sqft || 0;
};

// Helper function to map listing status to PropertyCard status
const mapListingStatus = (
  status: string | undefined,
): "For Sale" | "For Rent" | "Sold" | "Pending" => {
  if (!status) return "For Sale";

  const statusLower = status.toLowerCase();
  if (statusLower.includes("sold")) return "Sold";
  if (statusLower.includes("pending")) return "Pending";
  if (statusLower.includes("rent")) return "For Rent";
  return "For Sale";
};

// Helper function to get property location string
const getPropertyLocation = (property: CRMLSProperty): string => {
  if (!property.address) return "Location Available Upon Request";

  const { city, state } = property.address;
  const parts = [city, state].filter(Boolean);
  return parts.length > 0
    ? parts.join(", ")
    : "Location Available Upon Request";
};

// Helper function to get property image
const getPropertyImage = (property: CRMLSProperty): string => {
  // Check for property_images array first
  if (property.property_images && property.property_images.length > 0) {
    return property.property_images[0];
  }

  // Check for images array with objects
  if (property.images && property.images.length > 0) {
    return property.images[0].url;
  }

  // Fallback to default image
  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80";
};

// Helper function to get property title
const getPropertyTitle = (property: CRMLSProperty): string => {
  if (property.property_type && property.property_subtype) {
    return `${property.property_subtype} ${property.property_type}`;
  }
  return property.property_type || "Premium Property";
};

const PropertyGrid = ({ className = "" }: PropertyGridProps) => {
  const { listings, isLoading, error, totalCount, lastFetched } = useListings();
  const { fetchListings, refreshListings } = useListingsActions();

  // Fetch listings on component mount
  useEffect(() => {
    console.log("🎯 PropertyGrid useEffect triggered");
    console.log("📊 Current state:", {
      listings_count: listings?.length || 0,
      isLoading,
      error,
      lastFetched: lastFetched?.toISOString(),
    });

    // Only fetch if we don't have recent data (within last 5 minutes)
    const shouldFetch =
      !lastFetched || Date.now() - lastFetched.getTime() > 5 * 60 * 1000;

    console.log("🤔 Should fetch?", {
      shouldFetch,
      hasLastFetched: !!lastFetched,
      timeSinceLastFetch: lastFetched
        ? Date.now() - lastFetched.getTime()
        : "N/A",
      isCurrentlyLoading: isLoading,
    });

    if (shouldFetch && !isLoading) {
      console.log("✅ Triggering fetchListings...");
      fetchListings();
    } else {
      console.log("⏸️ Skipping fetch - conditions not met");
    }
  }, [fetchListings, lastFetched, isLoading]);

  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    refreshListings();
  };

  const hasListings = listings && listings.length > 0;

  // Debug logging for render state
  console.log("🎨 PropertyGrid render state:", {
    hasListings,
    listings_count: listings?.length || 0,
    isLoading,
    error,
    totalCount,
    lastFetched: lastFetched?.toISOString(),
  });

  return (
    <section className={`w-full bg-white py-16 ${className}`}>
      <div className="container max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              Featured Properties
            </h2>
            {!isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isLoading
              ? "Loading the latest property listings..."
              : hasListings
                ? `Discover our latest premium property listings (${totalCount} properties)`
                : "Browse our premium property collection"}
          </p>

          {lastFetched && !isLoading && (
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {lastFetched.toLocaleString()}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8 mb-8">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                Unable to Load Properties
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && listings.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-blue-500 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                Loading Properties
              </h3>
              <p className="text-muted-foreground">
                Fetching the latest listings from CRMLS...
              </p>
            </div>
          </div>
        )}

        {/* Property Grid */}
        {hasListings && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {listings.map((property) => {
              return (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={getPropertyTitle(property)}
                  price={formatCurrency(property.list_price)}
                  location={getPropertyLocation(property)}
                  beds={property.bedrooms || 0}
                  baths={property.bathrooms || 0}
                  sqft={formatSquareFootage(property.living_area)}
                  image={getPropertyImage(property)}
                  status={mapListingStatus(property.listing_status)}
                />
              );
            })}
          </div>
        )}

        {/* Empty State (only show if not loading and no error) */}
        {!hasListings && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6m-6 4h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                No Properties Available
              </h3>
              <p className="text-muted-foreground mb-6">
                We're currently updating our listings. Please check back soon
                for the latest properties.
              </p>
              <Button
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Check for Updates
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyGrid;
export type { PropertyGridProps };
