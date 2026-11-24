"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { isValidEmailAddress } from "@/lib/emailAddress";

/**
 * Client form in src/components/auth.
 * Collects an email for a password reset. Mail is not sent until an email service is connected.
 */
export function ForgotPasswordForm() {
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  /** Event handler. Validates the email and confirms the request on this page. */
  function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    if (!isValidEmailAddress(emailAddress)) {
      setEmailError("Enter a valid email address.");
      setStatusMessage("");
      return;
    }

    setEmailError("");
    setStatusMessage("If this email is registered, a reset link will be sent once mail is connected.");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <p className="auth-copy">
        Enter the email on your account. We will send a reset link when mail is connected.
      </p>

      <div className="field">
        <label className="field-label" htmlFor="reset-email">
          Email <span className="required-mark">*</span>
        </label>
        <input
          id="reset-email"
          className="field-input"
          type="email"
          value={emailAddress}
          autoComplete="email"
          required
          onChange={(changeEvent) => setEmailAddress(changeEvent.target.value)}
        />
        {emailError ? <p className="field-error">{emailError}</p> : null}
      </div>

      <button type="submit" className="primary-button">
        Send reset link
      </button>

      {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

      <div className="auth-links">
        <Link href="/login" className="back-link">
          Back
        </Link>
      </div>
    </form>
  );
}
