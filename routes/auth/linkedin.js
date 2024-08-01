import { Router } from "express";
import passport from "passport";

const router = Router();

// Initial login route
router.get("/", (req, res, next) => {
  const redirectUrl = req.query.redirect || "/";
  console.log("Initial login route - redirectUrl:", redirectUrl);
  passport.authenticate("linkedin", {
    state: Buffer.from(redirectUrl).toString("base64"), // Encode redirect URL to base64
  })(req, res, next);
});

// Callback route
router.get(
  "/callback",
  passport.authenticate("linkedin", {
    failureRedirect: "/auth/linkedin/failure",
    failureMessage: true,
  }),
  (req, res) => {
    const redirectUrl = req.query.state
      ? Buffer.from(req.query.state, "base64").toString("utf-8")
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
