import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URL,
  collectionName: "sessions",
  ttl: 24 * 60 * 60, // 1 day in seconds
});

store.on("connected", () => {
  console.log("Connected to MongoDB session store");
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "lax",
  },
  genid: () => {
    const sessionId = uuidv4();
    console.log("Generated Session ID:", sessionId);
    return sessionId;
  },
});

export const getSession = async (cookie) => {
  if (!cookie) return null;
  const sessionIdMatch = cookie.match(/connect\.sid=s%3A([^\.]+)\..+/);
  const sessionId = sessionIdMatch ? sessionIdMatch[1] : null;
  if (!sessionId) return null;
  console.log("Session ID from cookie:", sessionId);

  return new Promise((resolve, reject) => {
    store.get(sessionId, (err, session) => {
      if (err) {
        console.error("Error getting session:", err);
        return reject(err);
      }
      console.log("Session retrieved:", session);
      resolve(session);
    });
  });
};

export const commitSession = async (sessionId, sessionData) => {
  return new Promise((resolve, reject) => {
    store.set(sessionId, sessionData, (err) => {
      if (err) {
        console.error("Error saving session:", err);
        return reject(err);
      }
      console.log("Session saved:", sessionId);
      resolve(sessionId);
    });
  });
};

export const destroySession = async (sessionId) => {
  return new Promise((resolve, reject) => {
    store.destroy(sessionId, (err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return reject(err);
      }
      console.log("Session destroyed:", sessionId);
      resolve();
    });
  });
};

export { sessionMiddleware };
