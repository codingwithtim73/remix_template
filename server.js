import { createRequestHandler } from "@remix-run/express";
import express from "express";
import dotenv from "dotenv";
import compression from "compression"; // Import compression middleware
import morgan from "morgan";
import connectDB from "./dbconnect.js";
import passport from "./passport-config.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import { sessionMiddleware } from "./app/sessions.server.js";

import googleAuthRoutes from "./routes/auth/google.js";
import facebookAuthRoutes from "./routes/auth/facebook.js";
import appleAuthRoutes from "./routes/auth/apple.js";
import discordAuthRoutes from "./routes/auth/discord.js";
import linkedinAuthRoutes from "./routes/auth/linkedin.js";
import githubAuthRoutes from "./routes/auth/github.js";
import logoutRoute from "./routes/auth/logout.js";
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

// Apply the session middleware
app.use(sessionMiddleware);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Test route for creating a session
app.get("/test-session", (req, res) => {
  req.session.test = "This is a test session";
  req.session.save((err) => {
    if (err) {
      console.error("Error saving session:", err);
      return res.status(500).send("Error saving session");
    }
    console.log("Session saved:", req.session);
    res.send("Session created and saved successfully");
  });
});

// Authentication routes
app.use("/auth/google", googleAuthRoutes);
app.use("/auth/facebook", facebookAuthRoutes);
app.use("/auth/apple", appleAuthRoutes);
app.use("/auth/discord", discordAuthRoutes);
app.use("/auth/linkedin", linkedinAuthRoutes);
app.use("/auth/github", githubAuthRoutes);
app.use("/auth/logout", logoutRoute);

// Connect to MongoDB and start the server
connectDB()
  .then((db) => {
    app.locals.db = db;

    // handle SSR requests
    app.all("*", remixHandler);

    app.listen(port, () => {
      console.log(`Server started in ${environment} mode on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
