import type { VercelRequest, VercelResponse } from "@vercel/node";

// Add CORS headers helper
const setCorsHeaders = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

interface CRMLSProperty {
  id: string;
  mls_number?: string;
  list_price?: number;
  property_type?: string;
  property_subtype?: string;
  address?: {
    city?: string;
    state?: string;
    postal_code?: string;
    full_address?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  living_area?: number;
  listing_status?: string;
  property_images?: string[];
  images?: { url: string; description?: string; order?: number }[];
}

interface CRMLSListingsResponse {
  data: CRMLSProperty[];
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
  has_more?: boolean;
}

interface CRMLSErrorResponse {
  error: string;
  error_description?: string;
  message?: string;
  raw_error?: string;
}

// Named export for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("🚀 [LISTINGS] Handler called:", {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });

  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ [LISTINGS] Handling OPTIONS request");
    return res.status(200).end();
  }

  // Only allow GET and POST requests
  if (req.method !== "GET" && req.method !== "POST") {
    console.log("❌ [LISTINGS] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get environment variables
    const clientId = process.env.VITE_CRMLS_CLIENT_ID;
    const clientSecret = process.env.VITE_CRMLS_CLIENT_SECRET;
    const apiKey = process.env.VITE_CRMLS_API_KEY;

    console.log("🏠 Listings request - Environment check:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasApiKey: !!apiKey,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      method: req.method,
      url: req.url,
    });

    if (!clientId || !clientSecret) {
      console.error("❌ Missing CRMLS credentials");
      return res.status(500).json({
        error: "Server configuration error",
        message: "CRMLS credentials not configured",
        raw_error:
          "Missing environment variables: VITE_CRMLS_CLIENT_ID or VITE_CRMLS_CLIENT_SECRET",
      });
    }

    console.log("🏠 Starting CRMLS listings fetch process...");
    console.log("🔑 Step 1: Fetching OAuth token from Realtyna API...");

    // First, get the access token
    const tokenParams = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    });

    console.log("📋 Token request params:", {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: "[HIDDEN]",
      hasApiKey: !!apiKey,
    });

    // Add timeout for token request
    const tokenController = new AbortController();
    const tokenTimeoutId = setTimeout(() => tokenController.abort(), 30000);

    const tokenResponse = await fetch("https://api.realtyfeed.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "CRMLS-Proxy/1.0",
        ...(apiKey && { "X-API-Key": apiKey }),
      },
      body: tokenParams.toString(),
      signal: tokenController.signal,
    });

    clearTimeout(tokenTimeoutId);

    console.log("📥 Token response:", {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      headers: Object.fromEntries(tokenResponse.headers.entries()),
    });

    const tokenResponseText = await tokenResponse.text();
    console.log("📄 Token response body:", tokenResponseText);

    if (!tokenResponse.ok) {
      console.error("❌ Token fetch failed:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        body: tokenResponseText,
      });
      return res.status(tokenResponse.status).json({
        error: "Authentication failed",
        message: "Unable to authenticate with CRMLS API",
        raw_error: tokenResponseText,
      });
    }

    let tokenData;
    try {
      tokenData = JSON.parse(tokenResponseText);
    } catch (parseError) {
      console.error("❌ Failed to parse token response:", parseError);
      return res.status(500).json({
        error: "Invalid token response",
        message: "Failed to parse token response from CRMLS API",
        raw_error: tokenResponseText,
      });
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("❌ No access token received");
      return res.status(500).json({
        error: "Authentication failed",
        message: "No access token received from CRMLS API",
        raw_error: tokenResponseText,
      });
    }

    console.log("✅ Access token obtained successfully");
    console.log("🏠 [LISTINGS] Step 2: Fetching listings from CRMLS API...");

    // Handle both GET query params and POST body params
    const params = req.method === "GET" ? req.query : req.body || {};

    console.log("📋 [LISTINGS] Request params:", params);

    // Build the request body for POST to properties endpoint
    const requestBody = {
      page: parseInt(params.page?.toString() || "1"),
      per_page: parseInt(params.per_page?.toString() || "12"),
      sort_by: params.sort_by?.toString() || "list_price",
      sort_order: params.sort_order?.toString() || "desc",
      // Add any additional search filters
      ...(params.min_price && {
        min_price: parseInt(params.min_price.toString()),
      }),
      ...(params.max_price && {
        max_price: parseInt(params.max_price.toString()),
      }),
      ...(params.property_type && {
        property_type: params.property_type.toString(),
      }),
      ...(params.city && { city: params.city.toString() }),
      ...(params.state && { state: params.state.toString() }),
      ...(params.bedrooms && {
        bedrooms: parseInt(params.bedrooms.toString()),
      }),
      ...(params.bathrooms && {
        bathrooms: parseInt(params.bathrooms.toString()),
      }),
    };

    const listingsUrl = "https://api.realtyfeed.com/properties";

    console.log("📍 [LISTINGS] POST request to:", listingsUrl);
    console.log("📋 [LISTINGS] Request body:", requestBody);
    console.log(
      "🔑 [LISTINGS] Using access token:",
      accessToken ? `${accessToken.substring(0, 10)}...` : "[MISSING]",
    );

    // Add timeout for listings request
    const listingsController = new AbortController();
    const listingsTimeoutId = setTimeout(() => {
      console.log("⏰ [LISTINGS] Request timeout after 45 seconds");
      listingsController.abort();
    }, 45000);

    console.log("🚀 [LISTINGS] Making POST request to properties endpoint...");
    // Fetch listings from CRMLS API using POST method
    const listingsResponse = await fetch(listingsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "CRMLS-Proxy/1.0",
        ...(apiKey && { "X-API-Key": apiKey }),
      },
      body: JSON.stringify(requestBody),
      signal: listingsController.signal,
    });

    clearTimeout(listingsTimeoutId);

    console.log("📥 [LISTINGS] Response received:", {
      status: listingsResponse.status,
      statusText: listingsResponse.statusText,
      ok: listingsResponse.ok,
      headers: Object.fromEntries(listingsResponse.headers.entries()),
      url: listingsResponse.url,
    });

    const listingsResponseText = await listingsResponse.text();
    console.log(
      "📄 [LISTINGS] Response body (first 500 chars):",
      listingsResponseText.substring(0, 500),
    );
    console.log(
      "📊 [LISTINGS] Response body length:",
      listingsResponseText.length,
    );

    if (!listingsResponse.ok) {
      console.error("❌ [LISTINGS] Request failed:", {
        status: listingsResponse.status,
        statusText: listingsResponse.statusText,
        body: listingsResponseText,
        url: listingsResponse.url,
        request_body: requestBody,
      });

      let errorData: CRMLSErrorResponse;
      try {
        errorData = JSON.parse(listingsResponseText);
        errorData.raw_error = listingsResponseText;
      } catch {
        errorData = {
          error: "Listings fetch failed",
          message: `HTTP ${listingsResponse.status}: ${listingsResponse.statusText}`,
          raw_error: listingsResponseText,
        };
      }

      return res.status(listingsResponse.status).json(errorData);
    }

    let listingsData;
    try {
      listingsData = JSON.parse(listingsResponseText);
    } catch (parseError) {
      console.error("❌ Failed to parse listings response:", parseError);
      return res.status(500).json({
        error: "Invalid listings response",
        message: "Failed to parse listings response from CRMLS API",
        raw_error: listingsResponseText,
      });
    }

    console.log("✅ [LISTINGS] Fetched successfully");
    console.log("📊 [LISTINGS] Response structure:", {
      isArray: Array.isArray(listingsData),
      hasData: !!listingsData.data,
      hasListings: !!listingsData.listings,
      keys: Object.keys(listingsData),
      dataType: typeof listingsData,
    });

    // Handle different response formats
    let listings: CRMLSProperty[] = [];
    let total = 0;
    let page = 1;
    let hasMore = false;

    if (Array.isArray(listingsData)) {
      // Direct array response
      listings = listingsData;
      total = listings.length;
      console.log("📋 Using direct array format");
    } else if (listingsData.data && Array.isArray(listingsData.data)) {
      // Wrapped response
      listings = listingsData.data;
      total = listingsData.total || listings.length;
      page = listingsData.page || 1;
      hasMore = listingsData.has_more || false;
      console.log("📋 Using wrapped data format");
    } else if (listingsData.listings && Array.isArray(listingsData.listings)) {
      // Alternative format
      listings = listingsData.listings;
      total = listingsData.total || listings.length;
      page = listingsData.page || 1;
      hasMore = listingsData.has_more || false;
      console.log("📋 Using listings array format");
    } else {
      console.error("❌ Invalid response format:", {
        structure: typeof listingsData,
        keys: Object.keys(listingsData),
        sample: JSON.stringify(listingsData).substring(0, 200),
      });
      return res.status(500).json({
        error: "Invalid response format",
        message: "Unexpected response format from CRMLS API",
        raw_error: listingsResponseText,
      });
    }

    console.log(
      `📊 [LISTINGS] Returning ${listings.length} listings (total: ${total})`,
    );

    // Log sample listing for debugging
    if (listings.length > 0) {
      console.log(
        "🏡 [LISTINGS] Sample listing:",
        JSON.stringify(listings[0], null, 2),
      );
    }

    // Return formatted response
    const response: CRMLSListingsResponse = {
      data: listings,
      total,
      page,
      per_page: parseInt(params.per_page?.toString() || "12"),
      total_pages: Math.ceil(
        total / parseInt(params.per_page?.toString() || "12"),
      ),
      has_more: hasMore,
    };

    console.log("✅ [LISTINGS] Response ready:", {
      listings_count: response.data.length,
      total: response.total,
      page: response.page,
      per_page: response.per_page,
      has_more: response.has_more,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ [LISTINGS] Proxy error:", error);

    // Handle timeout errors specifically
    if (error instanceof Error && error.name === "AbortError") {
      return res.status(408).json({
        error: "Request timeout",
        message: "Request to CRMLS API timed out",
        raw_error: error.message,
      });
    }

    // Handle network errors
    if (
      error instanceof Error &&
      (error.message.includes("fetch") || error.message.includes("network"))
    ) {
      return res.status(503).json({
        error: "Network error",
        message: "Unable to connect to CRMLS API - network issue",
        raw_error: error.message,
        debug_info: {
          error_name: error.name,
          error_stack: error.stack,
        },
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
      raw_error: error instanceof Error ? error.stack : String(error),
    });
  }
}
