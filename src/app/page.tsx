import Navbar from "@/components/Navbar";
import Header from "@/components/Header/Header";
import ReferralForm from "@/components/ReferralForm/ReferralForm";
import styles from "@/styles/page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Invite Others to Join the Co-Op!</h1>
          <h2>Refer a Family Member or Friend</h2>
          {/* Referral Form */}
          <ReferralForm />
        </div>
        <div className={styles.heroImage}>
          <Image src="/produce.jpg" alt="Fresh Produce" width={500} height={500} layout="intrinsic" />
        </div>
      </section>

      {/* Why Refer & Referral History */}
      <section className={styles.referralSection}>
        <div className={styles.leftSection}>
          <h2>Why Should I Refer?</h2>
          <p>By referring others, you can help our community reach its goal of hitting ___ members!</p>
          <h2>Prizes</h2>
          <p>For every referral, you gain one __________.</p>
        </div>
        <div className={styles.rightSection}>
          <h2 className={styles.referralHistoryTitle}>Referral History</h2>
        </div>
      </section>
    </main>
  );
}
