import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Image src="/assets/logo.png" alt="Dummy Logo" width={223} height={73} />
    </header>
  );
}
