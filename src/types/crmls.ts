// CRMLS API Response Types
export interface CRMLSTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface CRMLSTokenRequest {
  grant_type: "client_credentials";
  client_id: string;
  client_secret: string;
}

// Property Address Interface
export interface PropertyAddress {
  street_number?: string;
  street_name?: string;
  unit_number?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  full_address?: string;
}

// Property Images Interface
export interface PropertyImage {
  url: string;
  description?: string;
  order?: number;
}

// Main Property Listing Interface
export interface CRMLSProperty {
  id: string;
  mls_number?: string;
  list_price?: number;
  original_list_price?: number;
  property_type?: string;
  property_subtype?: string;
  address?: PropertyAddress;
  bedrooms?: number;
  bathrooms?: number;
  half_bathrooms?: number;
  living_area?: number;
  lot_size?: number;
  year_built?: number;
  listing_status?: string;
  listing_date?: string;
  days_on_market?: number;
  property_images?: string[];
  images?: PropertyImage[];
  description?: string;
  features?: string[];
  parking_spaces?: number;
  garage_spaces?: number;
  pool?: boolean;
  fireplace?: boolean;
  air_conditioning?: boolean;
  heating?: string;
  flooring?: string[];
  appliances?: string[];
  utilities?: string[];
  zoning?: string;
  tax_amount?: number;
  tax_year?: number;
  hoa_fee?: number;
  listing_agent?: {
    name?: string;
    phone?: string;
    email?: string;
    license?: string;
  };
  listing_office?: {
    name?: string;
    phone?: string;
  };
  virtual_tour_url?: string;
  latitude?: number;
  longitude?: number;
  school_district?: string;
  elementary_school?: string;
  middle_school?: string;
  high_school?: string;
  created_at?: string;
  updated_at?: string;
}

// API Response for Property Listings
export interface CRMLSListingsResponse {
  data: CRMLSProperty[];
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
  has_more?: boolean;
}

// API Error Response
export interface CRMLSErrorResponse {
  error: string;
  error_description?: string;
  message?: string;
  status?: number;
  raw_error?: string;
}

// Search Parameters for Property Listings
export interface CRMLSSearchParams {
  city?: string;
  state?: string;
  postal_code?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  property_type?: string;
  listing_status?: string;
  min_sqft?: number;
  max_sqft?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Store State Interface
export interface CRMLSStoreState {
  listings: CRMLSProperty[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}
