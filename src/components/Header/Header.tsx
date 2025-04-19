import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Image src="/assets/logo.png" alt="Paso Logo" fill className={styles.logoImage} />
      </div>
    </header>
  );
}
