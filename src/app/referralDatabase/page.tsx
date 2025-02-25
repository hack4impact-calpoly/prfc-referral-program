import ReferralDataGrid from "@/components/ReferralDatabase/ReferralDataGrid";
import Header from "@/components/Header/Header";
import styles from "./referralDatabase.module.css";
import localFont from "next/font/local";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// // Load font manually
// const komikaAxis = localFont({
//   src: "../../public/fonts/KomikaAxis.ttf",
//   display: "swap",
// });

//referral page to display user data
export default function ReferralDatabase() {
  return (
    <div>
      <Header />
      <div className={styles.referralHistContainer}>
        <h1 className={`${styles.pageTitle}`}>Referral History</h1>
        <ReferralDataGrid />
      </div>
    </div>
  );
}
