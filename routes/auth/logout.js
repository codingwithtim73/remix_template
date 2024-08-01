import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const redirectUrl = req.query.redirect || "/";
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return res.status(500).send("Failed to destroy session");
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect(redirectUrl);
    });
  });
});

export default router;
