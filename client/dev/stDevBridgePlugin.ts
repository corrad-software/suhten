import type { Plugin } from "vite";

/**
 * Dev-only bridge: terminal scripts POST commands; the ST SPA polls GET to apply.
 * Not included in production builds.
 */
export function stDevBridgePlugin(): Plugin {
  let pendingHours = 0;
  let pendingReset = false;

  function mount(
    path: string,
    handlers: {
      post: (body: string, res: import("http").ServerResponse) => void;
      get: (res: import("http").ServerResponse) => void;
    },
  ) {
    return (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: () => void) => {
      if (req.url && req.url !== "/" && !req.url.startsWith("/?")) {
        return next();
      }
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => handlers.post(body, res));
        return;
      }
      if (req.method === "GET") {
        handlers.get(res);
        return;
      }
      next();
    };
  }

  return {
    name: "st-dev-bridge",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(
        "/__dev/st/tick",
        mount("/__dev/st/tick", {
          post: (body, res) => {
            try {
              const parsed = JSON.parse(body || "{}") as { hours?: number };
              const hours = Number(parsed.hours ?? 2);
              if (!Number.isFinite(hours) || hours <= 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "hours must be a positive number" }));
                return;
              }
              pendingHours += hours;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, queuedHours: pendingHours }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "invalid JSON body" }));
            }
          },
          get: (res) => {
            const hours = pendingHours;
            pendingHours = 0;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ hours }));
          },
        }),
      );

      server.middlewares.use(
        "/__dev/st/reset",
        mount("/__dev/st/reset", {
          post: (_body, res) => {
            pendingReset = true;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, queued: true }));
          },
          get: (res) => {
            const reset = pendingReset;
            pendingReset = false;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ reset }));
          },
        }),
      );
    },
  };
}
