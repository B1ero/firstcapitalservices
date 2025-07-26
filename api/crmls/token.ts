import type { VercelRequest, VercelResponse } from "@vercel/node";

// Ensure this is treated as a serverless function
export const config = {
  runtime: "nodejs18.x",
  maxDuration: 30,
};

// Add CORS headers helper
const setCorsHeaders = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

interface CRMLSTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface CRMLSErrorResponse {
  error: string;
  error_description?: string;
  message?: string;
  raw_error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("🔑 [TOKEN] Handler called:", {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });

  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ [TOKEN] Handling OPTIONS request");
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log("❌ [TOKEN] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get environment variables
    const clientId = process.env.VITE_CRMLS_CLIENT_ID;
    const clientSecret = process.env.VITE_CRMLS_CLIENT_SECRET;
    const apiKey = process.env.VITE_CRMLS_API_KEY;

    console.log("🔑 [TOKEN] Starting token request...");
    console.log("🔑 [TOKEN] Environment check:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasApiKey: !!apiKey,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      timestamp: new Date().toISOString(),
    });

    if (!clientId || !clientSecret) {
      console.error("❌ [TOKEN] Missing CRMLS credentials");
      return res.status(500).json({
        error: "Server configuration error",
        message: "CRMLS credentials not configured",
        raw_error:
          "Missing environment variables: VITE_CRMLS_CLIENT_ID or VITE_CRMLS_CLIENT_SECRET",
        debug_info: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          env_keys: Object.keys(process.env).filter((key) =>
            key.includes("CRMLS"),
          ),
        },
      });
    }

    console.log("🔄 [TOKEN] Fetching OAuth token from Realtyna API...");
    console.log("📍 [TOKEN] Endpoint: https://api.realtyfeed.com/auth/token");

    // Prepare token request
    const tokenParams = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    });

    console.log("📋 [TOKEN] Request params:", {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: "[HIDDEN]",
      hasApiKey: !!apiKey,
      body_length: tokenParams.toString().length,
    });

    // Make request to CRMLS API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ [TOKEN] Request timeout after 30 seconds");
      controller.abort();
    }, 30000);

    console.log("🚀 [TOKEN] Making request to Realtyna API...");
    const response = await fetch("https://api.realtyfeed.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "CRMLS-Proxy/1.0",
        ...(apiKey && { "X-API-Key": apiKey }),
      },
      body: tokenParams.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📥 [TOKEN] Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
    });

    const responseText = await response.text();
    console.log("📄 [TOKEN] Response body:", responseText);

    if (!response.ok) {
      console.error("❌ [TOKEN] Request failed:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        url: response.url,
      });

      let errorData: CRMLSErrorResponse;
      try {
        errorData = JSON.parse(responseText);
        errorData.raw_error = responseText;
      } catch {
        errorData = {
          error: "Authentication failed",
          message: `HTTP ${response.status}: ${response.statusText}`,
          raw_error: responseText,
        };
      }

      return res.status(response.status).json(errorData);
    }

    let tokenData: CRMLSTokenResponse;
    try {
      tokenData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ [TOKEN] Failed to parse response:", parseError);
      return res.status(500).json({
        error: "Invalid response format",
        message: "Failed to parse token response from CRMLS API",
        raw_error: responseText,
      });
    }

    if (!tokenData.access_token) {
      console.error("❌ [TOKEN] No access token in response");
      return res.status(500).json({
        error: "Invalid token response",
        message: "No access token received from CRMLS API",
        raw_error: responseText,
      });
    }

    console.log("✅ [TOKEN] Success:", {
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      has_access_token: !!tokenData.access_token,
      token_preview: tokenData.access_token
        ? `${tokenData.access_token.substring(0, 10)}...`
        : "[MISSING]",
    });

    // Return the token data
    return res.status(200).json(tokenData);
  } catch (error) {
    console.error("❌ [TOKEN] Proxy error:", error);

    // Handle timeout errors specifically
    if (error instanceof Error && error.name === "AbortError") {
      return res.status(408).json({
        error: "Request timeout",
        message: "Request to CRMLS API timed out after 30 seconds",
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
