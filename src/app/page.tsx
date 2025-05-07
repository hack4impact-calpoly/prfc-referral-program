import Header from "@/components/Header/Header";
import ReferralForm from "@/components/ReferralForm/ReferralForm";
import styles from "@/styles/page.module.css";
import Image from "next/image";
import { Suspense } from "react";

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
          <Suspense fallback={<div>Loading...</div>}>
            <ReferralForm />
          </Suspense>
        </div>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/produce.jpg"
            alt="Fresh Produce"
            fill
            className={styles.heroImage}
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>

      {/* Why Refer & Referral History */}
      <section className={styles.referralSection}>
        <div className={styles.leftSection}>
          <div className={styles.produceImageWrapper}>
            <Image
              src="/produce_2.jpg"
              alt="Fresh Produce"
              fill
              className={styles.produceImage}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className={styles.rightSection}>
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
      </section>
    </main>
  );
}
