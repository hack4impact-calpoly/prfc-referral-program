"use client";

import React, { useState } from "react";
import styles from "./RedeemForm.module.css";

export default function RedeemForm() {
    const [formData, setFormData] = useState<{ [key: string]: string}>({
        yourEmail: "",
        redeemCode: "",
      });

      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
      };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const { yourEmail, redeemCode } = formData;

        if (!yourEmail || !redeemCode) {
            console.log("Please fill in all fields!");
            return;
        }
        console.log("Form submitted successfully: ", formData);
    };

    return (
        <div className={styles.container}>
          <h1 className={styles.title}>Redeem Your Code</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            {[
              { id: "yourEmail", label: "Your Email", type: "email", placeholder: "Enter your email" },
              { id: "redeemCode", label: "Redeem Code", type: "text", placeholder: "Enter redeem code" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className={styles.label}>
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  value={formData[id]}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className={styles.input}
                />
              </div>
            ))}
            <button type="submit" className={styles.button}>
              Submit
            </button>
          </form>
        </div>
      );
    }