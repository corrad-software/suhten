#!/usr/bin/env node
/**
 * Reset ST prototype demo data to the initial seed state.
 *
 * Usage:
 *   node client/scripts/st-reset.mjs
 *
 * Requires `composer dev` (Vite on port 5180) and an open ST portal tab.
 */

const port = process.env.VITE_PORT ?? process.env.ST_VITE_PORT ?? 5180;
const base = process.env.ST_DEV_URL ?? `http://localhost:${port}`;
const url = `${base}/__dev/st/reset`;

try {
  const res = await fetch(url, { method: "POST" });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed (${res.status}): ${text}`);
    console.error(`Is the dev server running at ${base}? (composer dev)`);
    process.exit(1);
  }

  await res.json();
  console.log("Queued demo data reset.");
  console.log("Applied automatically within ~1s on any open /st tab.");
} catch (err) {
  console.error(`Could not reach ${url}`);
  console.error(err instanceof Error ? err.message : err);
  console.error("Start the app with: composer dev");
  process.exit(1);
}
