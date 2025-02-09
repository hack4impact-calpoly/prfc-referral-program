"use client"; // Marks this file as a client component

import styles from "./ReferralForm.module.css";

import React, { useState } from "react";

export default function ReferralForm() {
  const [yourEmail, setYourEmail] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Functionality to be implemented later
    console.log("Submit button clicked, but no action defined yet.");
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
        <div>
          <label htmlFor="refereeEmail" className={styles.label}>
            Referee Email
          </label>
          <input
            id="refereeEmail"
            type="email"
            value={refereeEmail}
            onChange={(e) => setRefereeEmail(e.target.value)}
            placeholder="Enter referee's email"
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}
