import React from "react";
import styles from "./searchbar.module.css";

function SearchBar() {
  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
      />
    </div>
  );
}

export default SearchBar;
