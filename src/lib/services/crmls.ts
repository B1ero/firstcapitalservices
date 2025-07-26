import type {
  CRMLSTokenResponse,
  CRMLSTokenRequest,
  CRMLSProperty,
  CRMLSListingsResponse,
  CRMLSErrorResponse,
  CRMLSSearchParams,
} from "@/types/crmls";

class CRMLSService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private apiKey: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    // Use Vercel serverless functions instead of direct API calls
    this.baseUrl = "";
    this.clientId = "";
    this.clientSecret = "";
    this.apiKey = "";

    console.log("🔧 CRMLS Service Configuration:", {
      mode: "Vercel Proxy",
      tokenEndpoint: "/api/crmls/token",
      listingsEndpoint: "/api/crmls/listings",
      environment: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      viteMode: import.meta.env.VITE_MODE,
    });
  }

  /**
   * Check if the current access token is valid and not expired
   */
  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }

    // Check if token expires in the next 5 minutes (buffer time)
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return new Date().getTime() < this.tokenExpiry.getTime() - bufferTime;
  }

  /**
   * Authenticate with CRMLS API using Vercel proxy
   */
  private async authenticate(): Promise<string> {
    if (this.isTokenValid() && this.accessToken) {
      console.log("✅ Using existing valid CRMLS token");
      return this.accessToken;
    }

    console.log("🔄 Fetching new CRMLS OAuth token via Vercel proxy...");
    console.log("📍 Token endpoint: /api/crmls/token");

    try {
      const response = await fetch("/api/crmls/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(
        "📥 Token response status:",
        response.status,
        response.statusText,
      );

      const responseText = await response.text();
      console.log("📄 Token response body:", responseText);

      if (!response.ok) {
        console.error("❌ Token fetch failed - Response:", {
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        });

        let errorData: CRMLSErrorResponse;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = {
            error: "Authentication failed",
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        // Include raw error in the thrown error message
        const errorMessage =
          errorData.raw_error ||
          errorData.message ||
          errorData.error ||
          "Authentication failed";
        throw new Error(errorMessage);
      }

      let tokenData: CRMLSTokenResponse;
      try {
        tokenData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse token response:", parseError);
        throw new Error(`Failed to parse token response: ${responseText}`);
      }

      console.log("✅ Token received successfully:", {
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        access_token: tokenData.access_token ? "[RECEIVED]" : "[MISSING]",
      });

      if (!tokenData.access_token) {
        throw new Error("No access token received from CRMLS API");
      }

      this.accessToken = tokenData.access_token;
      // Set token expiry (default to 1 hour if not provided)
      const expiresInMs = (tokenData.expires_in || 3600) * 1000;
      this.tokenExpiry = new Date(Date.now() + expiresInMs);

      console.log(
        "✅ CRMLS authentication successful, token expires at:",
        this.tokenExpiry,
      );
      return this.accessToken;
    } catch (error) {
      console.error("❌ CRMLS authentication failed:", error);
      this.accessToken = null;
      this.tokenExpiry = null;
      throw error;
    }
  }

  /**
   * Fetch property listings from CRMLS API via Vercel proxy
   */
  async getListings(
    params: CRMLSSearchParams = {},
  ): Promise<CRMLSListingsResponse> {
    console.log(
      "🏠 [SERVICE] Starting CRMLS listings fetch via Vercel proxy...",
    );
    console.log("📋 [SERVICE] Search parameters:", params);

    try {
      // Set default parameters - using 12 per page as requested
      const searchParams = {
        page: 1,
        per_page: 12,
        sort_by: "list_price",
        sort_order: "desc",
        ...params,
      };

      console.log(
        "📍 [SERVICE] Fetching CRMLS listings from: /api/crmls/listings",
      );
      console.log("🔍 [SERVICE] Final search params:", searchParams);

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log("⏰ [SERVICE] Request timeout after 30 seconds");
        controller.abort();
      }, 30000);

      const response = await fetch("/api/crmls/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(searchParams),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📥 [SERVICE] Listings response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      });

      const responseText = await response.text();
      console.log(
        "📄 [SERVICE] Response body (first 500 chars):",
        responseText.substring(0, 500),
      );

      if (!response.ok) {
        console.error("❌ [SERVICE] Listings fetch failed:", {
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        });

        let errorData: CRMLSErrorResponse;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = {
            error: "Listings fetch failed",
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        // Include raw error in the thrown error message
        const errorMessage =
          errorData.raw_error ||
          errorData.message ||
          errorData.error ||
          "Failed to fetch listings";
        throw new Error(errorMessage);
      }

      let listingsResponse: CRMLSListingsResponse;
      try {
        listingsResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "❌ [SERVICE] Failed to parse listings response:",
          parseError,
        );
        throw new Error(`Failed to parse listings response: ${responseText}`);
      }

      // Validate response structure
      if (!listingsResponse || !listingsResponse.data) {
        console.error(
          "❌ [SERVICE] Invalid response structure:",
          listingsResponse,
        );
        throw new Error("Invalid response received from listings API");
      }

      const listings = listingsResponse.data;
      const total = listingsResponse.total || listings.length;
      const page = listingsResponse.page || 1;
      const hasMore = listingsResponse.has_more || false;

      console.log(
        `✅ [SERVICE] Successfully fetched ${listings.length} listings via Vercel proxy`,
      );
      console.log("📊 [SERVICE] Response summary:", {
        total_listings: listings.length,
        total_count: total,
        current_page: page,
        has_more: hasMore,
      });

      // Log first listing for debugging
      if (listings.length > 0) {
        console.log("🏡 [SERVICE] Sample listing (first):", listings[0]);
      }

      return listingsResponse;
    } catch (error) {
      console.error(
        "❌ [SERVICE] Failed to fetch CRMLS listings via proxy:",
        error,
      );
      console.error("🔍 [SERVICE] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });

      throw error;
    }
  }

  /**
   * Get a single property by ID via Vercel proxy
   */
  async getProperty(id: string): Promise<CRMLSProperty> {
    try {
      console.log("Fetching CRMLS property via proxy:", id);

      const response = await fetch(`/api/crmls/listings?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle single property response
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0];
      } else if (data.id) {
        return data;
      }

      throw new Error("Property not found");
    } catch (error) {
      console.error("Failed to fetch CRMLS property:", error);
      throw error;
    }
  }

  /**
   * Test the API connection via Vercel proxy
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log("🧪 [SERVICE] Testing CRMLS proxy connection...");

      const response = await fetch("/api/crmls/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const success = response.ok;
      console.log(
        success
          ? "✅ [SERVICE] CRMLS proxy connection test successful"
          : "❌ [SERVICE] CRMLS proxy connection test failed",
      );

      if (!success) {
        const errorText = await response.text();
        console.error("❌ [SERVICE] Connection test error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
      }

      return success;
    } catch (error) {
      console.error("❌ [SERVICE] CRMLS proxy connection test failed:", error);
      return false;
    }
  }

  /**
   * Clear stored authentication data
   */
  clearAuth(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
  }
}

// Export a singleton instance
export const crmlsService = new CRMLSService();
export default crmlsService;
