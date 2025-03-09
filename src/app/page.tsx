import Navbar from "@/components/Navbar";
import Header from "@/components/Header/Header";
import ReferralForm from "@/components/ReferralForm/ReferralForm";
import styles from "@/styles/page.module.css";
import Image from "next/image";
import { Luckiest_Guy } from "next/font/google";

const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={luckiestGuy.className} style={{ width: "500px" }}>
            <h1>Invite Others to Join the Co-Op!</h1>
            <h2>Refer a Family Member or Friend</h2>
          </div>
          {/* Referral Form */}
          <ReferralForm />
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/produce.jpg"
            alt="Fresh Produce"
            width={500} 
            height={500} 
            layout="intrinsic" 
          />
        </div>
      </section>

      {/* Why Refer & Referral History */}
      <section className={styles.referralSection}>
        <div className={styles.leftSection}>
          <div className={luckiestGuy.className}>
            <h2>Why Should I Refer?</h2>
            <p>By referring others, you can help our community reach its goal of hitting ___ members!</p>
            <h2>Prizes</h2>
            <p>For every referral, you gain one __________.</p>
          </div>
        </div>
        <div className={styles.rightSection}>
          <h2 className={`${luckiestGuy.className} ${styles.referralHistoryTitle}`}>Referral History</h2>
        </div>
      </section>
    </main>
  );
}