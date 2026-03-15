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
app.notFound(notFoundMiddleware);
showRoutes(app);
const server = Bun.serve({
  port: config.PORT,
  fetch: app.fetch,
});

console.log(`Listening on ${server.url}`);
