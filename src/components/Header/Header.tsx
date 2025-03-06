import React from "react";
import styles from "./Header.module.css"; // Ensure this is the correct path

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src="/logo.jpg" alt="Logo" className={styles.logo} />
      </div>
    </header>
  );
};

export default Header;
