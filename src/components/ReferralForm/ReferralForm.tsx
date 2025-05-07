"use client";

import styles from "./ReferralForm.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { calculateChecksum } from "@/utils/checksum";

export default function ReferralForm() {
  const searchParams = useSearchParams();
  const [yourEmail, setYourEmail] = useState("");
  const [prospects, setProspects] = useState([{ email: "", firstName: "", lastName: "" }]);
  const [referrerEmail, setReferrerEmail] = useState("");
  const [referrerFirstName, setReferrerFirstName] = useState("");
  const [referrerLastName, setReferrerLastName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State to manage confirmation of Referral Submission
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!searchParams) return;
    const fullName = searchParams.get("nm") || "".trim();
    const email = searchParams.get("em") || "";
    const code = searchParams.get("ref") || "";

    const nameParts = fullName.split(" ");
    setReferrerFirstName(nameParts[0] || "");
    setReferrerLastName(nameParts.slice(1).join(" ") || "");
    setReferrerEmail(email);
    setReferralCode(code);

    if (email) {
      setYourEmail(email);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];
      if (!prospect.email.trim() || !prospect.firstName.trim() || !prospect.lastName.trim()) {
        setErrorMessage(`Please fill out all fields for Prospect ${i + 1}.`);
        return;
      }
    }

    const em = referrerEmail;
    const nm = `${referrerFirstName} ${referrerLastName}`;
    const ref = referralCode;
    const cs = searchParams.get("cs");

    if (!cs) {
      setErrorMessage("Invalid URL: Missing checksum.");
      return;
    }

    const calculatedChecksum = calculateChecksum(`${em}${nm}${ref}`);

    if (calculatedChecksum !== cs) {
      setErrorMessage("Invalid URL: Checksum mismatch.");
      return;
    }

    const referralData = {
      member_name: nm.trim(),
      member_email: em,
      referral_code: ref,
      prospects: prospects.map((prospect) => ({
        prospect_name: `${prospect.firstName} ${prospect.lastName}`.trim(),
        prospect_email: prospect.email,
      })),
    };

    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referralData),
      });

      if (response.ok) {
        console.log("Referral created successfully");
        setProspects([{ email: "", firstName: "", lastName: "" }]);
        setYourEmail("");
        setShowConfirmation(true); // Show confirmation popup
      } else {
        setErrorMessage("Failed to submit the form. Please try again!");
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting the form.");
    }
  };

  const handleProspectChange = (index: number, field: "email" | "firstName" | "lastName", value: string) => {
    const newProspects = [...prospects];
    newProspects[index][field] = value;
    setProspects(newProspects);
  };

  const addProspect = () => {
    setProspects([...prospects, { email: "", firstName: "", lastName: "" }]);
  };

  const deleteProspect = (index: number) => {
    const newProspects = [...prospects];
    newProspects.splice(index, 1);
    setProspects(newProspects);
  };

  return (
    <div className={styles.container}>
      {showConfirmation && (
        <div className={styles.confirmationPopup}>
          <div className={styles.confirmationContent}>
            <p>🎉 Referral submitted successfully!</p>
            <button onClick={() => setShowConfirmation(false)} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.referrerEmail}>
          <label htmlFor="yourEmail" className={styles.label}></label>
          <input
            id="yourEmail"
            type="email"
            value={yourEmail}
            onChange={(e) => setYourEmail(e.target.value)}
            placeholder="Referrer's Email Address"
            className={styles.input}
            readOnly
          />
        </div>
        <div className={styles.prospectList}>
          {prospects.map((prospect, index) => (
            <div key={index} className={styles.prospectContainer}>
              <div className={styles.nameRow}>
                <label htmlFor={`prospectFirstName${index}`} className={styles.label}></label>
                <input
                  id={`prospectFirstName${index}`}
                  type="text"
                  value={prospect.firstName}
                  onChange={(e) => handleProspectChange(index, "firstName", e.target.value)}
                  placeholder="Enter First Name"
                  className={styles.input}
                />
                <label htmlFor={`prospectLastName${index}`} className={styles.label}></label>
                <input
                  id={`prospectLastName${index}`}
                  type="text"
                  value={prospect.lastName}
                  onChange={(e) => handleProspectChange(index, "lastName", e.target.value)}
                  placeholder="Enter Last Name"
                  className={styles.input}
                />
              </div>
              <div className={styles.emailAndDelete}>
                <button type="button" onClick={() => deleteProspect(index)} className={styles.crossButton}>
                  <Image src="/trash.png" alt="Delete" width={18} height={18} />
                </button>
                <label htmlFor={`prospectEmail${index}`} className={styles.label}></label>
                <input
                  id={`prospectEmail${index}`}
                  type="email"
                  value={prospect.email}
                  onChange={(e) => handleProspectChange(index, "email", e.target.value)}
                  placeholder="Enter Referee Email Address"
                  className={styles.input}
                />
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className={styles.button}>
          Invite
        </button>
        <button type="button" onClick={addProspect} className={styles.plusBox}>
          +
        </button>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <input type="hidden" name="referrerEmail" value={referrerEmail} />
        <input type="hidden" name="referrerFirstName" value={referrerFirstName} />
        <input type="hidden" name="referrerLastName" value={referrerLastName} />
        <input type="hidden" name="referralCode" value={referralCode} />
      </form>
    </div>
  );
}
