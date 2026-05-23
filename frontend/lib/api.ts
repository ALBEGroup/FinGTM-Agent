// API client — handles all communication with the FastAPI backend
import type { ProductInput, GTMApiResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function generateGTMPack(
  input: ProductInput
): Promise<GTMApiResponse> {
  // Use AbortController for broad browser compatibility (AbortSignal.timeout is newer)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180_000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-gtm-pack`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return { success: false, error: `Server error ${response.status}: ${errorText}` };
    }

    const data: GTMApiResponse = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return { success: false, error: "Request timed out after 3 minutes. The GTM report is large — please try again." };
      }
      // Network error — backend unreachable
      if (err.name === "TypeError") {
        return {
          success: false,
          error:
            "Cannot connect to backend at http://localhost:8000. " +
            "Please check: (1) uvicorn is running, (2) DEEPSEEK_API_KEY is set, (3) try refreshing and clicking Generate again.",
        };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}