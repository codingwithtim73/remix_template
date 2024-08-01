// app/routes/login/route.jsx
import { useLocation } from "@remix-run/react";
import styles from "./login.module.css";
import { useEffect, useState } from "react";

/**
 *
 * images from https://uxwing.com/
 */
export default function Login() {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error) {
      setErrorMessage(error);
    }
  }, [location]);

  const redirectUrl =
    new URLSearchParams(location.search).get("redirect") || "/";
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <div className={styles.loginOptions}>
        <a
          href={`/auth/google?redirect=${encodeURIComponent(redirectUrl)}`}
          className={`${styles.loginButton} ${styles.google}`}
        >
          <img src="/images/google-icon.svg" alt="Google Icon" /> Login with
          Google
        </a>
        <a
          href="/auth/facebook"
          className={`${styles.loginButton} ${styles.facebook}`}
        >
          <img src="/images/facebook-icon.svg" alt="Facebook Icon" /> Login with
          Facebook
        </a>
        <a
          href="/auth/apple"
          className={`${styles.loginButton} ${styles.apple}`}
        >
          <img src="/images/apple-icon.svg" alt="Apple Icon" /> Login with Apple
        </a>
        <a
          href="/auth/linkedin"
          className={`${styles.loginButton} ${styles.linkedin}`}
        >
          <img src="/images/linkedin-icon.svg" alt="LinkedIn Icon" /> Login with
          LinkedIn
        </a>
        <a
          href="/auth/github"
          className={`${styles.loginButton} ${styles.github}`}
        >
          <img src="/images/github-icon.svg" alt="GitHub Icon" /> Login with
          GitHub
        </a>
        <a
          href="/auth/discord"
          className={`${styles.loginButton} ${styles.discord}`}
        >
          <img src="/images/discord-icon.svg" alt="Discord Icon" /> Login with
          Discord
        </a>
      </div>
    </div>
  );
}
