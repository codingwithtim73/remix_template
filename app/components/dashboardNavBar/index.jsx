import { Link } from "@remix-run/react";
import styles from "./dashboard.module.css";
export default function DashboardNavbar({ sidebarVisible, showSidebar }) {
  console.log("the dashboard sidebar visible value is " + sidebarVisible);
  return (
    <div>
      <nav
        className={
          sidebarVisible
            ? styles.navWrapper
            : `${styles.navWrapper} ${styles.navbar}`
        }
      >
        <ul className={styles.navul}>
          <li>
            <Link className={styles.navlink} to="/account">
              Account Home
            </Link>
          </li>
          <li>
            <Link className={styles.navlink} to="/account/profile">
              Profile
            </Link>
          </li>
          <li>
            <Link className={styles.navlink} to="/account/settings">
              Settings
            </Link>
          </li>
        </ul>
        <button
          className={styles.nav_btn}
          onClick={() => showSidebar(!sidebarVisible)}
          type="button"
        >
          {sidebarVisible ? "<" : ">"}
        </button>
      </nav>
    </div>
  );
}
