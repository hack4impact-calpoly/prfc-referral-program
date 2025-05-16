import type { Metadata } from "next";
import "./globals.css";

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "Paso Robles Food Co-op Referral Program",
  description:
    "Join the Paso Robles Food Co-op and help grow our community through this referral program. Built by Hack4Impact at Cal Poly!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
