import { API_BASE_URL } from "@/env";

/** In-flight CSRF bootstrap so concurrent callers share one /sanctum/csrf-cookie round-trip. */
let csrfBootstrap: Promise<void> | null = null;

/**
 * After a hard session invalidate the readable XSRF cookie may linger.
 * Next ensureCsrfCookie() must refresh even when a cookie is still present.
 */
let csrfStale = false;

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

/** Mark Sanctum CSRF unusable (call when the session cookie is known invalid). */
export function markCsrfStale(): void {
  csrfStale = true;
}

/** Shared in-flight server logout so login can cancel it on single-threaded serve. */
let logoutInFlight: Promise<void> | null = null;
let logoutAbort: AbortController | null = null;

/** Cancel a background logout so the next login is not queued behind it. */
export function cancelLogoutInFlight(): void {
  if (logoutAbort) {
    logoutAbort.abort();
    logoutAbort = null;
  }
  logoutInFlight = null;
}

/** Track a background logout; pass an AbortSignal so login can cancel it. */
export function trackLogout(run: (signal: AbortSignal) => Promise<unknown>): void {
  if (logoutInFlight) {
    return;
  }
  logoutAbort = new AbortController();
  const { signal } = logoutAbort;
  logoutInFlight = Promise.resolve()
    .then(() => run(signal))
    .catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      // Ignore network errors — local session is already cleared.
    })
    .finally(() => {
      logoutInFlight = null;
      logoutAbort = null;
    });
}

/** Resolve when any in-flight logout finishes (or immediately if none). */
export function waitForLogout(): Promise<void> {
  return logoutInFlight ?? Promise.resolve();
}

/** True while /api/auth/logout is still in flight (router must not call /me). */
export function isLogoutInFlight(): boolean {
  return logoutInFlight !== null;
}

function buildHeaders(init?: HeadersInit) {
  const headers = new Headers(init ?? {});
  if (!headers.has("Content-Type") && !(init instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getCsrfToken();
  if (token) {
    headers.set("X-XSRF-TOKEN", token);
  }
  return headers;
}

function isCsrfMismatch(status: number, message: unknown): boolean {
  if (typeof message !== "string") return false;
  const normalized = message.toLowerCase();
  return status === 419 || normalized.includes("csrf token mismatch");
}

/**
 * Ensure the browser has a Sanctum XSRF-TOKEN cookie (and matching session).
 * Concurrent callers always share one in-flight request (never race two csrf-cookie calls).
 * Pass `force` on login-page mount / after a CSRF failure so a stale cookie is replaced.
 */
export async function ensureCsrfCookie(force = false): Promise<void> {
  // Always join an in-flight refresh — even if a leftover cookie is still readable.
  if (csrfBootstrap) {
    await csrfBootstrap;
    return;
  }

  if (!force && !csrfStale && getCsrfToken()) {
    return;
  }

  csrfStale = false;
  csrfBootstrap = fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to initialize CSRF cookie (${response.status})`);
      }
    })
    .finally(() => {
      csrfBootstrap = null;
    });

  await csrfBootstrap;
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, retried = false): Promise<T> {
  const isForm = options.body instanceof FormData;
  const headers = isForm ? new Headers(options.headers) : buildHeaders(options.headers);

  // Always include CSRF token, even for FormData uploads
  if (isForm) {
    const token = getCsrfToken();
    if (token) {
      headers.set("X-XSRF-TOKEN", token);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const payload = (await parseJson(response)) as {
    data?: unknown;
    error?: { message?: string };
  } | null;

  if (!response.ok) {
    // Aborted logout/login should surface as AbortError to callers.
    if (options.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const message = payload?.error?.message || "Request failed";
    const method = (options.method ?? "GET").toUpperCase();
    const mutating = method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

    // Stale XSRF / racing csrf-cookie can leave header and session out of sync.
    if (!retried && mutating && isCsrfMismatch(response.status, message)) {
      await ensureCsrfCookie(true);
      return apiRequest<T>(path, options, true);
    }

    throw new Error(message);
  }

  return payload as T;
}
