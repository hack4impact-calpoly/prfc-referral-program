import React from "react";
import styles from "./Header.module.css"; // Ensure this is the correct path
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        {/* <img src="/logo.jpg" alt="Logo" className={styles.logo} /> */}
        <Image
          src="/logo.jpg"
          alt="Logo"
          className={styles.logo}
          width={120} // Adjust based on your needs
          height={60}
          priority // Optional: load early for better LCP
        />
      </div>
    </header>
  );
};

export default Header;
