import Navbar from "@/components/Navbar";
import RedeemForm from "@/components/RedeemForm/RedeemForm";
import ReferralForm from "@/components/ReferralForm/ReferralForm";

export default function Home() {
  return (
    <main>
      <Navbar />
      <h1>Home</h1>
      <ReferralForm></ReferralForm>
      <RedeemForm></RedeemForm>
    </main>
  );
}
