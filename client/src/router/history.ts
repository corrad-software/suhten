import {
  createMemoryHistory,
  createWebHistory,
  type RouterHistory,
} from "vue-router";

import { MASK_URL } from "@/env";

const MASKED_PATH_KEY = "corrad:masked-route";

/** Address bar shows origin only (browsers may add a trailing slash). */
function maskedBrowserUrl(): string {
  return `${window.location.origin}/`;
}

function pathFromWindow(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

let historyPatched = false;

/**
 * Force every History API write to the origin root so nothing (including
 * createWebHistory) can put paths back into the address bar.
 */
function patchHistoryApi(): void {
  if (historyPatched || typeof window === "undefined") {
    return;
  }
  historyPatched = true;

  const target = maskedBrowserUrl();
  const origPush = window.history.pushState.bind(window.history);
  const origReplace = window.history.replaceState.bind(window.history);

  window.history.pushState = (state, title, _url) => {
    origPush(state, title, target);
  };
  window.history.replaceState = (state, title, _url) => {
    origReplace(state, title, target);
  };
}

function resolveInitialPath(): string {
  const fromUrl = pathFromWindow();
  if (fromUrl && fromUrl !== "/") {
    return fromUrl;
  }
  const fromSession = sessionStorage.getItem(MASKED_PATH_KEY);
  if (fromSession && fromSession.startsWith("/")) {
    return fromSession;
  }
  return "/";
}

/**
 * When MASK_URL is enabled, Vue Router keeps full paths in memory while the
 * browser address bar only shows the origin (e.g. http://localhost:5180/).
 * The last path is stored in sessionStorage so a refresh can restore the page.
 */
export function createAppHistory(): RouterHistory {
  if (!MASK_URL || typeof window === "undefined") {
    return createWebHistory();
  }

  const initialPath = resolveInitialPath();

  // Patch first, then clear the visible URL before the router starts navigating.
  patchHistoryApi();
  window.history.replaceState(window.history.state, "", maskedBrowserUrl());

  const history = createMemoryHistory();
  history.replace(initialPath);
  return history;
}

/** Persist the logical route so refresh still lands on the same page. */
export function persistMaskedRoute(fullPath: string): void {
  if (!MASK_URL || typeof window === "undefined") {
    return;
  }
  sessionStorage.setItem(MASKED_PATH_KEY, fullPath);
  patchHistoryApi();
  window.history.replaceState(window.history.state, "", maskedBrowserUrl());
}
