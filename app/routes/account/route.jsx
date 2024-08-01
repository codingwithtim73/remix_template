import { Outlet, Link } from "@remix-run/react";
import { useState } from "react";
import styles from "./account.module.css";
import DashboardNavbar from "../../components/dashboardNavBar";

export default function Account() {
  const [sidebarVisible, showSidebar] = useState(false);

  const toggleMenu = () => {
    showSidebar(!sidebarVisible);
  };
  console.log(
    "the values of sidebarVisible in the account route",
    sidebarVisible
  );
  return (
    <div className={styles.account}>
      <aside>
        <DashboardNavbar
          sidebarVisible={sidebarVisible}
          showSidebar={showSidebar}
        />
        {/*  <button onClick={toggleMenu} className={styles.menuButton}>
          {sidebarVisible ? "<" : ">"}
        </button>
        <nav>
          <ul>
            <li>
              <Link to="/account">Account Home</Link>
            </li>
            <li>
              <Link to="/account/profile">Profile</Link>
            </li>
            <li>
              <Link to="/account/settings">Settings</Link>
            </li>
          </ul>
        </nav> */}
      </aside>
      <main
        className={
          !showSidebar
            ? styles.page
            : `${styles.page} ${styles.page_with_navbar}`
        }
      >
        <Outlet context={{ sidebarVisible }} />
      </main>
    </div>
  );
}
