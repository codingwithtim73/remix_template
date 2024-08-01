import { Link, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";
import styles from "./header.module.css";
import SearchBar from "../searchbar";
import MobileApp from "../mobileapp";

export default function Header({ user }) {
  const [menuActive, setMenuActive] = useState(false);
  const location = useLocation(false);
  const currentUrl = location.pathname + location.search;

  console.log("the user in the header", user);
  useEffect(() => {
    console.log("Current URL:", currentUrl);
  }, [currentUrl]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <header className={styles.header}>
      <div className={styles.navcontainer}>
        <nav className={styles.nav}>
          <div className={styles.mobileHeader}>
            <div className={styles.logo}>
              <Link to="/">
                <picture>
                  <source
                    srcSet="/images/logo_mobile.webp 50w"
                    media="(max-width: 600px)"
                    type="image/webp"
                  />
                  <source
                    srcSet="/images/logo_mobile.jpg 50w"
                    media="(max-width: 600px)"
                    type="image/jpeg"
                  />
                  <source
                    srcSet="/images/logo.webp 50w"
                    media="(min-width: 601px)"
                    type="image/webp"
                  />
                  <source
                    srcSet="/images/logo.png 50w"
                    media="(min-width: 601px)"
                    type="image/jpeg"
                  />
                  <img
                    src="/images/logo.png"
                    className={styles.logoImg}
                    alt="Logo"
                  />
                </picture>
              </Link>
            </div>
            <button
              className={`${styles.menuButton} ${
                menuActive ? styles.active : ""
              }`}
              onClick={toggleMenu}
            >
              {menuActive ? "✖" : "☰"}
            </button>
          </div>
          <div
            className={`${styles.navMenuContainer} ${
              menuActive ? styles.active : ""
            }`}
          >
            <SearchBar />
            <ul className={styles.navMenu}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
            </ul>
            <div className={styles.loginContainer}>
              {user ? (
                <>
                  <li className={styles.desktopOnly}>
                    <div className={styles.avatarContainer}>
                      <img
                        src={
                          user.profilePicture || "/images/user-profile-icon.png"
                        } // Replace with user's avatar URL
                        alt="User Avatar"
                        height="30px"
                        width="30px"
                        className={styles.avatar}
                      />
                      <div className={styles.dropdownMenu}>
                        <Link to="/account" className={styles.dropdownItem}>
                          Account
                        </Link>
                        <a
                          href={`/auth/logout?redirect=${encodeURIComponent(
                            currentUrl
                          )}`}
                          className={styles.dropdownItem}
                        >
                          Logout
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className={styles.mobileOnly}>
                    <Link to="/account">Account</Link>
                  </li>
                  <li className={styles.mobileOnly}>
                    <a
                      href={`/auth/logout?redirect=${encodeURIComponent(
                        currentUrl
                      )}`}
                      className={styles.loginButton}
                    >
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <Link
                  to={`/login?redirect=${encodeURIComponent(currentUrl)}`}
                  className={`${styles.loginButton} ${
                    isLoginPage ? styles.disabled : ""
                  }`}
                  aria-disabled={isLoginPage}
                >
                  Sign in / Signup
                </Link>
              )}
            </div>
            <MobileApp />
          </div>
        </nav>
      </div>
    </header>
  );
}
