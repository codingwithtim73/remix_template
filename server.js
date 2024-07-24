import { createRequestHandler } from "@remix-run/express";
import express from "express";
import dotenv from "dotenv";
import compression from "compression"; // Import compression middleware
import morgan from "morgan";
// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || "development";
console.log("Environment:", environment);
console.log("The port is", port);

const viteDevServer =
  environment === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});
const app = express();

// Use compression middleware
app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));
app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

app.listen(port, () => {
  console.log(`Server started in ${environment} mode on port ${port}`);
});
