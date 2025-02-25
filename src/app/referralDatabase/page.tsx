import ReferralDataGrid from "@/components/ReferralDatabase/ReferralDataGrid";
import Header from "@/components/Header/Header";
import styles from "./referralDatabase.module.css";

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
