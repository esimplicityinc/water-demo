import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

/**
 * Convex HTTP client for server-side usage in API routes
 */
export const convexClient = new ConvexHttpClient(CONVEX_URL);

// Re-export api for convenience
export { api };
