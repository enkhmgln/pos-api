import { join } from "node:path";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { showRoutes } from "hono/dev";
import { config } from "./constants/config";
import {
  globalErrorHandler,
  notFoundMiddleware,
  responseMiddleware,
} from "./middleware";
import routes from "./routes/base.route";

const app = new Hono();

app.use(secureHeaders());
app.use(cors());
app.use(logger());
app.use(responseMiddleware);
app.onError(globalErrorHandler);
app.route("/api", routes);
app.get("/uploads/*", async (c) => {
  const name = c.req.path.replace(/^\/uploads\//, "");
  if (!name || name.includes("..")) return notFoundMiddleware(c);
  const fullPath = join(process.cwd(), config.UPLOAD_DIR, name);
  const file = Bun.file(fullPath);
  if (!(await file.exists())) return notFoundMiddleware(c);
  return new Response(file);
});
app.notFound(notFoundMiddleware);
showRoutes(app);
const server = Bun.serve({
  port: config.PORT,
  fetch: app.fetch,
});

console.log(`Listening on ${server.url}`);
