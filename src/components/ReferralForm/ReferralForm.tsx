"use client"; // Marks this file as a client component

import styles from "./ReferralForm.module.css"; // Importing CSS module for styling

import React, { useState } from "react"; // Importing React and useState hook

export default function ReferralForm() {
  // State to manage the user's email
  const [yourEmail, setYourEmail] = useState("");
  // State to manage the list of prospects
  const [prospects, setProspects] = useState([{ email: "", firstName: "", lastName: "" }]);

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Functionality to be implemented later
    console.log("Submit button clicked, but no action defined yet.");
  };

  // Function to handle changes in prospect fields
  const handleProspectChange = (index: number, field: string, value: string) => {
    const newProspects = [...prospects];
    newProspects[index][field] = value;
    setProspects(newProspects);
  };

  // Function to add a new prospect to the list
  const addProspect = () => {
    setProspects([...prospects, { email: "", firstName: "", lastName: "" }]);
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
          <div key={index}>
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
        <input type="hidden" name="referrerEmail" value="referrer@example.com" />
        <input type="hidden" name="referrerFirstName" value="ReferrerFirstName" />
        <input type="hidden" name="referrerLastName" value="ReferrerLastName" />
        <input type="hidden" name="referralCode" value="REF12345" />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}