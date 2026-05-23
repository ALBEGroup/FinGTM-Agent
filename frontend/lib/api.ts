// API client — handles all communication with the FastAPI backend
import type { ProductInput, GTMApiResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const DEMO_TOKEN_KEY = "fingtm_demo_access_token";

function getDemoToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(DEMO_TOKEN_KEY) ?? "";
}

export function saveDemoToken(token: string): void {
  if (typeof window === "undefined") return;
  if (token.trim()) {
    localStorage.setItem(DEMO_TOKEN_KEY, token.trim());
  } else {
    localStorage.removeItem(DEMO_TOKEN_KEY);
  }
}

export async function generateGTMPack(
  input: ProductInput,
  externalSignal?: AbortSignal
): Promise<GTMApiResponse> {
  // Internal 180-second timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180_000);

  // Forward external abort (e.g. user-initiated cancel / regenerate) to internal controller
  externalSignal?.addEventListener("abort", () => controller.abort(), { once: true });

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const demoToken = getDemoToken();
  if (demoToken) {
    headers["X-Demo-Access-Token"] = demoToken;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-gtm-pack`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Demo access token is missing or invalid." };
      }
      if (response.status === 429) {
        return { success: false, error: "Too many requests. Please wait a moment and try again." };
      }
      if (response.status >= 500) {
        return { success: false, error: "Failed to generate GTM pack. Please check backend logs for details." };
      }
      const errorText = await response.text().catch(() => "Unknown error");
      return { success: false, error: `Server error ${response.status}: ${errorText}` };
    }

    const data: GTMApiResponse = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        // Distinguish user-cancelled from timeout
        if (externalSignal?.aborted) {
          return { success: false, error: "Request cancelled." };
        }
        return {
          success: false,
          error: "Request timed out after 3 minutes. The GTM report is large — please try again.",
        };
      }
      if (err.name === "TypeError") {
        return {
          success: false,
          error:
            "Cannot connect to the backend. Please check that the server is running and try again.",
        };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
