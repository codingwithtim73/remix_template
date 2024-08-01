import { Router } from "express";
import passport from "passport";

const router = Router();

// Initial login route
router.get("/", (req, res, next) => {
  const redirectUrl = req.query.redirect || "/";
  console.log("Initial login route - redirectUrl:", redirectUrl);
  passport.authenticate("apple", {
    scope: ["email"],
    state: Buffer.from(redirectUrl).toString("base64"), // Encode redirect URL to base64
  })(req, res, next);
});

// Callback route
router.post(
  "/callback",
  passport.authenticate("apple", {
    failureRedirect: "/auth/apple/failure",
    failureMessage: true,
  }),
  (req, res) => {
    const redirectUrl = req.body.state
      ? Buffer.from(req.body.state, "base64").toString("utf-8")
      : "/";
    res.redirect(redirectUrl);
  }
);

// Failure route
router.get("/failure", (req, res) => {
  const errorMessage = req.session.messages ? req.session.messages.pop() : "";
  const redirectUrl = `/login?error=${encodeURIComponent(errorMessage)}`;
  res.redirect(redirectUrl);
});

export default router;
