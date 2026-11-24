"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GoogleContinueButton } from "@/components/auth/GoogleContinueButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { RobotCheck } from "@/components/auth/RobotCheck";
import { isValidEmailAddress } from "@/lib/emailAddress";
import { saveLodgeSession } from "@/lib/lodgeSession";

/**
 * Client form in src/components/auth.
 * Same card fields as the sign-up screen: Google, email, password, terms, and the robot check.
 */
export function RegisterForm() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [robotConfirmed, setRobotConfirmed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [robotError, setRobotError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  /** Event handler. Google sign-up is visible, but not connected. */
  function handleGoogleContinue() {
    setStatusMessage("Google sign-up will be connected in a later step.");
  }

  /** Event handler. Checks the sign-up fields, then opens the portal with this email. */
  function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    setStatusMessage("");

    const nextEmailError = isValidEmailAddress(emailAddress) ? "" : "Enter a valid email address.";
    const nextPasswordError =
      passwordValue.trim().length >= 8 ? "" : "Use at least 8 characters.";
    const nextTermsError = acceptedTerms ? "" : "Agree to the Terms of Use to continue.";
    const nextRobotError = robotConfirmed ? "" : "Confirm you are not a robot.";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setTermsError(nextTermsError);
    setRobotError(nextRobotError);

    if (nextEmailError || nextPasswordError || nextTermsError || nextRobotError) {
      return;
    }

    saveLodgeSession({ emailAddress: emailAddress.trim() });
    router.push("/portal");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <GoogleContinueButton onGoogleContinue={handleGoogleContinue} />
      {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

      <div className="or-divider">
        <span>or</span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="register-email">
          Email <span className="required-mark">*</span>
        </label>
        <input
          id="register-email"
          className="field-input"
          type="email"
          value={emailAddress}
          autoComplete="email"
          required
          onChange={(changeEvent) => setEmailAddress(changeEvent.target.value)}
        />
        {emailError ? <p className="field-error">{emailError}</p> : null}
      </div>

      <PasswordField
        fieldId="register-password"
        label="Password"
        required
        passwordValue={passwordValue}
        autoComplete="new-password"
        onPasswordChange={setPasswordValue}
      />
      {passwordError ? <p className="field-error field-error-offset">{passwordError}</p> : null}

      <label className="terms-row">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(changeEvent) => setAcceptedTerms(changeEvent.target.checked)}
        />
        <span>
          By creating an account you agree to our <Link href="/terms">Terms of Use</Link>
        </span>
      </label>
      {termsError ? <p className="field-error field-error-tight">{termsError}</p> : null}

      <RobotCheck robotConfirmed={robotConfirmed} onRobotConfirmedChange={setRobotConfirmed} />
      {robotError ? <p className="field-error field-error-tight">{robotError}</p> : null}

      <button type="submit" className="primary-button">
        Get Started
      </button>

      <div className="auth-links">
        <p className="auth-prompt">
          Already have an account? <Link href="/login">Login</Link>
        </p>
        <Link href="/login" className="back-link">
          Back
        </Link>
      </div>
    </form>
  );
}
