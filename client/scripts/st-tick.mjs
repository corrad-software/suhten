#!/usr/bin/env node
/**
 * Advance the ST prototype demo clock (same as the old "Maju 2j" UI button).
 *
 * Usage:
 *   node client/scripts/st-tick.mjs        # default +2 hours
 *   node client/scripts/st-tick.mjs 4      # +4 hours
 *
 * Requires `composer dev` (Vite on port 5180) and an open ST portal tab.
 */

const hours = Number(process.argv[2] ?? 2);
const port = process.env.VITE_PORT ?? process.env.ST_VITE_PORT ?? 5180;
const base = process.env.ST_DEV_URL ?? `http://localhost:${port}`;
const url = `${base}/__dev/st/tick`;

if (!Number.isFinite(hours) || hours <= 0) {
  console.error("Usage: node client/scripts/st-tick.mjs [hours]");
  console.error("  hours must be a positive number (default: 2)");
  process.exit(1);
}

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hours }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed (${res.status}): ${text}`);
    console.error(`Is the dev server running at ${base}? (composer dev)`);
    process.exit(1);
  }

  const data = await res.json();
  console.log(`Queued demo clock +${hours}h (pending total: ${data.queuedHours}h).`);
  console.log("Applied automatically within ~1s on any open /st tab.");
} catch (err) {
  console.error(`Could not reach ${url}`);
  console.error(err instanceof Error ? err.message : err);
  console.error("Start the app with: composer dev");
  process.exit(1);
}
