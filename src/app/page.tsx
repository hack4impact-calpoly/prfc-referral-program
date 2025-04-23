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
          <div className={styles.heroTitle}>
            <h1>Invite Others to Join the Co-Op!</h1>
            <h2>Refer a Family Member or Friend</h2>
          </div>
          {/* Referral Form */}
          <ReferralForm />
        </div>
        <div className={styles.heroImage}>
          <Image src="/produce.jpg" alt="Fresh Produce" width={600} height={600} layout="intrinsic" />
        </div>
      </section>

      {/* Why Refer & Referral History */}
      <section className={styles.referralSection}>
        <div className={styles.leftSection}>
          <h2>Why Should I Refer?</h2>
          <p>
            Each new member brings fresh ideas, helps us offer more events, and keeps our shelves stocked with an even
            wider variety of products.
          </p>
          <h2>Prizes</h2>
          <p>
            For each new member you bring in, you’ll earn points to redeem special prizes. Past prizes have included
            bottles of wine, engraved bricks, and more.
          </p>
        </div>
        <div className={styles.rightSection}>
          <h2 className={styles.referralHistoryTitle}>Referral History</h2>
        </div>
      </section>
    </main>
  );
}
