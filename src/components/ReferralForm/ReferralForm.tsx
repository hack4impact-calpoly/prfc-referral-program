"use client"; // Marks this file as a client component

import styles from "./ReferralForm.module.css"; // Importing CSS module for styling

import React, { useState, useEffect } from "react"; // Importing React and useState hook
import { useSearchParams } from "next/navigation"; // Importing useSearchParams from Next.js

export default function ReferralForm() {
  // State to manage the user's email
  const [yourEmail, setYourEmail] = useState("");
  // State to manage the list of prospects
  const [prospects, setProspects] = useState([{ email: "", firstName: "", lastName: "" }]);
  // State to manage hidden fields
  const [referrerEmail, setReferrerEmail] = useState("");
  const [referrerFirstName, setReferrerFirstName] = useState("");
  const [referrerLastName, setReferrerLastName] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // Retrieve search parameters from the URL
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract data from URL search parameters
    const fullName = searchParams.get("nm") || "";
    const email = searchParams.get("em") || "";
    const code = searchParams.get("ref") || "";

    // Split full name into first and last name
    const [firstName, lastName] = fullName.split(" ");

    // Set state variables with extracted data
    setReferrerEmail(email);
    setReferrerFirstName(firstName || "");
    setReferrerLastName(lastName || "");
    setReferralCode(code);
  }, [searchParams]);

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create referral data object
    const referralData = {
      referrerEmail,
      referrerFirstName,
      referrerLastName,
      referralCode,
      yourEmail,
      prospects,
    };

    try {
      // Send POST request to create a new referral
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referralData),
      });

      if (response.ok) {
        console.log("Referral created successfully");
      } else {
        console.error("Failed to create referral");
      }
    } catch (error) {
      console.error("Error creating referral:", error);
    }
  };

  // Function to handle changes in prospect fields
  type ProspectField = "email" | "firstName" | "lastName";

  const handleProspectChange = (index: number, field: ProspectField, value: string) => {
    const newProspects = [...prospects];
    newProspects[index][field] = value;
    setProspects(newProspects);
  };

  // Function to add a new prospect to the list
  const addProspect = () => {
    setProspects([...prospects, { email: "", firstName: "", lastName: "" }]);
  };

  // Function to delete a prospect from the list
  const deleteProspect = (index: number) => {
    const newProspects = [...prospects];
    newProspects.splice(index, 1);
    setProspects(newProspects);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Submission Form</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="yourEmail" className={styles.label}>
            Your Email
          </label>
          <input
            id="yourEmail"
            type="email"
            value={yourEmail}
            onChange={(e) => setYourEmail(e.target.value)}
            placeholder="Enter your email"
            className={styles.input}
          />
        </div>
        {prospects.map((prospect, index) => (
          <div key={index} className={styles.prospectContainer}>
            <button type="button" onClick={() => deleteProspect(index)} className={styles.crossButton}>
              ✖
            </button>
            <label htmlFor={`prospectEmail${index}`} className={styles.label}>
              Prospect Email
            </label>
            <input
              id={`prospectEmail${index}`}
              type="email"
              value={prospect.email}
              onChange={(e) => handleProspectChange(index, "email", e.target.value)}
              placeholder="Enter prospect's email"
              className={styles.input}
            />
            <label htmlFor={`prospectFirstName${index}`} className={styles.label}>
              Prospect First Name
            </label>
            <input
              id={`prospectFirstName${index}`}
              type="text"
              value={prospect.firstName}
              onChange={(e) => handleProspectChange(index, "firstName", e.target.value)}
              placeholder="Enter prospect's first name"
              className={styles.input}
            />
            <label htmlFor={`prospectLastName${index}`} className={styles.label}>
              Prospect Last Name
            </label>
            <input
              id={`prospectLastName${index}`}
              type="text"
              value={prospect.lastName}
              onChange={(e) => handleProspectChange(index, "lastName", e.target.value)}
              placeholder="Enter prospect's last name"
              className={styles.input}
            />
          </div>
        ))}
        <button type="button" onClick={addProspect} className={styles.button}>
          Add Another Prospect
        </button>
        {/* Hidden fields for referrer details and referral code */}
        <input type="hidden" name="referrerEmail" value={referrerEmail} />
        <input type="hidden" name="referrerFirstName" value={referrerFirstName} />
        <input type="hidden" name="referrerLastName" value={referrerLastName} />
        <input type="hidden" name="referralCode" value={referralCode} />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}