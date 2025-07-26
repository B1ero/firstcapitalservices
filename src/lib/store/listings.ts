import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  CRMLSProperty,
  CRMLSSearchParams,
  CRMLSStoreState,
} from "@/types/crmls";
import { crmlsService } from "@/lib/services/crmls";

interface ListingsActions {
  // Fetch listings with optional search parameters
  fetchListings: (params?: CRMLSSearchParams) => Promise<void>;

  // Fetch a single property by ID
  fetchProperty: (id: string) => Promise<CRMLSProperty | null>;

  // Load more listings (pagination)
  loadMoreListings: () => Promise<void>;

  // Refresh listings (clear cache and fetch fresh data)
  refreshListings: () => Promise<void>;

  // Clear all listings and reset state
  clearListings: () => void;

  // Set error state
  setError: (error: string | null) => void;

  // Set loading state
  setLoading: (loading: boolean) => void;

  // Update search parameters
  updateSearchParams: (params: CRMLSSearchParams) => void;

  // Get listings by status
  getListingsByStatus: (status: string) => CRMLSProperty[];

  // Get listings by price range
  getListingsByPriceRange: (
    minPrice?: number,
    maxPrice?: number,
  ) => CRMLSProperty[];
}

interface ListingsStore extends CRMLSStoreState {
  // Current search parameters
  searchParams: CRMLSSearchParams;

  // Actions
  actions: ListingsActions;
}

const initialState: CRMLSStoreState = {
  listings: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  totalCount: 0,
  currentPage: 1,
  hasMore: true,
};

const initialSearchParams: CRMLSSearchParams = {
  page: 1,
  per_page: 50,
  sort_by: "list_price",
  sort_order: "desc",
};

export const useListingsStore = create<ListingsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      searchParams: initialSearchParams,

      actions: {
        fetchListings: async (params?: CRMLSSearchParams) => {
          const state = get();

          // Don't fetch if already loading
          if (state.isLoading) {
            console.log("⏸️ Skipping fetch - already loading");
            return;
          }

          console.log("🚀 Starting listings fetch from store...");
          console.log("🔍 Store state before fetch:", {
            listings_count: state.listings.length,
            error: state.error,
            lastFetched: state.lastFetched,
          });
          set({ isLoading: true, error: null });

          try {
            const searchParams = {
              ...state.searchParams,
              ...params,
            };

            console.log("📋 Final search params for CRMLS:", searchParams);

            const response = await crmlsService.getListings(searchParams);

            // Ensure we have a valid response
            if (!response) {
              throw new Error("No response received from CRMLS service");
            }

            const listings = response.data || [];
            const totalCount = response.total || listings.length || 0;
            const currentPage = response.page || 1;
            const hasMore =
              response.has_more ??
              listings.length === (searchParams.per_page || 50);

            console.log("📊 Store update summary:", {
              listings_count: listings.length,
              total_count: totalCount,
              current_page: currentPage,
              has_more: hasMore,
            });

            set({
              listings,
              totalCount,
              currentPage,
              hasMore,
              lastFetched: new Date(),
              isLoading: false,
              error: null,
              searchParams,
            });

            console.log(
              `✅ Store updated successfully with ${listings.length} listings`,
            );

            // Log empty state specifically
            if (listings.length === 0) {
              console.log("📭 No listings returned - will show empty state UI");
              console.log("🔍 Response details:", {
                response_data: response.data,
                response_total: response.total,
                response_keys: Object.keys(response || {}),
                raw_response: response,
                data_type: typeof response.data,
                data_is_array: Array.isArray(response.data),
              });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to fetch listings";

            console.error("❌ Store fetch error:", errorMessage);
            console.error("🔍 Full error details:", error);

            // Provide more specific error messages
            let userFriendlyError = errorMessage;
            if (errorMessage.includes("credentials not configured")) {
              userFriendlyError =
                "CRMLS API credentials are not properly configured. Please check your environment variables.";
            } else if (errorMessage.includes("Authentication failed")) {
              userFriendlyError =
                "Failed to authenticate with CRMLS API. Please verify your credentials.";
            } else if (
              errorMessage.includes("Failed to fetch") ||
              errorMessage.includes("NetworkError")
            ) {
              userFriendlyError =
                "Unable to connect to CRMLS API. Please check your internet connection and try again.";
            }

            set({
              isLoading: false,
              error: userFriendlyError,
              listings: [],
              totalCount: 0,
              hasMore: false,
            });

            console.log("💥 Store updated with error state");
          }
        },

        fetchProperty: async (id: string) => {
          try {
            console.log("Fetching property:", id);
            const property = await crmlsService.getProperty(id);

            // Update the property in the listings if it exists
            const state = get();
            const updatedListings = state.listings.map((listing) =>
              listing.id === id ? property : listing,
            );

            // If property not in listings, don't add it (it's a detail view)
            if (updatedListings.some((listing) => listing.id === id)) {
              set({ listings: updatedListings });
            }

            return property;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to fetch property";
            console.error("Error fetching property:", errorMessage);
            set({ error: errorMessage });
            return null;
          }
        },

        loadMoreListings: async () => {
          const state = get();

          if (state.isLoading || !state.hasMore) {
            return;
          }

          const nextPage = state.currentPage + 1;
          const searchParams = {
            ...state.searchParams,
            page: nextPage,
          };

          set({ isLoading: true, error: null });

          try {
            console.log("Loading more listings, page:", nextPage);

            const response = await crmlsService.getListings(searchParams);

            set({
              listings: [...state.listings, ...(response.data || [])],
              currentPage: nextPage,
              hasMore:
                response.has_more ??
                response.data?.length === searchParams.per_page,
              isLoading: false,
              error: null,
            });

            console.log(`Loaded ${response.data?.length || 0} more listings`);
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to load more listings";
            console.error("Error loading more listings:", errorMessage);

            set({
              isLoading: false,
              error: errorMessage,
            });
          }
        },

        refreshListings: async () => {
          const state = get();

          // Reset to first page and clear existing listings
          const refreshParams = {
            ...state.searchParams,
            page: 1,
          };

          set({
            listings: [],
            currentPage: 1,
            hasMore: true,
            lastFetched: null,
          });

          await get().actions.fetchListings(refreshParams);
        },

        clearListings: () => {
          set({
            ...initialState,
            searchParams: initialSearchParams,
          });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        setLoading: (isLoading: boolean) => {
          set({ isLoading });
        },

        updateSearchParams: (params: CRMLSSearchParams) => {
          const state = get();
          const newParams = {
            ...state.searchParams,
            ...params,
            page: 1, // Reset to first page when search params change
          };

          set({ searchParams: newParams });
        },

        getListingsByStatus: (status: string) => {
          const state = get();
          return state.listings.filter(
            (listing) =>
              listing.listing_status?.toLowerCase() === status.toLowerCase(),
          );
        },

        getListingsByPriceRange: (minPrice?: number, maxPrice?: number) => {
          const state = get();
          return state.listings.filter((listing) => {
            const price = listing.list_price;
            if (!price) return false;

            if (minPrice && price < minPrice) return false;
            if (maxPrice && price > maxPrice) return false;

            return true;
          });
        },
      },
    }),
    {
      name: "listings-store",
      partialize: (state) => ({
        // Only persist listings and search params, not loading/error states
        listings: state.listings,
        searchParams: state.searchParams,
        lastFetched: state.lastFetched,
        totalCount: state.totalCount,
      }),
    },
  ),
);

// Convenience hooks for common operations
export const useListings = () => {
  const store = useListingsStore();
  return {
    listings: store.listings,
    isLoading: store.isLoading,
    error: store.error,
    totalCount: store.totalCount,
    hasMore: store.hasMore,
    lastFetched: store.lastFetched,
  };
};

export const useListingsActions = () => {
  return useListingsStore((state) => state.actions);
};

export const useSearchParams = () => {
  return useListingsStore((state) => state.searchParams);
};
