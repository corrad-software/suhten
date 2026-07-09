import { useStWorkflowStore } from "../stores/workflow";

const POLL_MS = 1_000;
let started = false;

/** Polls the Vite dev server for terminal-queued demo commands (tick / reset). */
export function startStDevBridge() {
  if (!import.meta.env.DEV || started || typeof window === "undefined") return;
  started = true;

  window.setInterval(async () => {
    try {
      const [tickRes, resetRes] = await Promise.all([
        fetch("/__dev/st/tick"),
        fetch("/__dev/st/reset"),
      ]);

      if (tickRes.ok) {
        const tick = (await tickRes.json()) as { hours?: number };
        const hours = Number(tick.hours ?? 0);
        if (hours > 0) {
          useStWorkflowStore().tick(hours);
        }
      }

      if (resetRes.ok) {
        const reset = (await resetRes.json()) as { reset?: boolean };
        if (reset.reset) {
          useStWorkflowStore().resetDemo();
        }
      }
    } catch {
      // Dev server not running or route unavailable.
    }
  }, POLL_MS);
}
