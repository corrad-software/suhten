export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * When enabled, the browser address bar shows only the origin (domain + port).
 * Set MASK_URL=true (or TRUE) in the repo root .env and restart Vite.
 *
 * Value is injected by vite.config.ts (replace marker below).
 */
export const MASK_URL = false; // __MASK_URL_INJECT__
