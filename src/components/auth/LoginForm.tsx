"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { GoogleContinueButton } from "@/components/auth/GoogleContinueButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { RobotCheck } from "@/components/auth/RobotCheck";
import { isValidEmailAddress } from "@/lib/emailAddress";
import {
  forgetRememberedEmailAddress,
  readRememberedEmailAddress,
  rememberEmailAddress,
  saveLodgeSession,
} from "@/lib/lodgeSession";

/**
 * Client form in src/components/auth.
 * Collects email, password, remember-me, and the robot check, then opens the portal.
 * Accounts are not stored on a server yet. Only the email is kept in this browser.
 */
export function LoginForm() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [robotConfirmed, setRobotConfirmed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [robotError, setRobotError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const rememberedEmailAddress = readRememberedEmailAddress();
    if (rememberedEmailAddress) {
      setEmailAddress(rememberedEmailAddress);
      setRememberMe(true);
    }
  }, []);

  /** Event handler. Google sign-in is visible, but not connected. */
  function handleGoogleContinue() {
    setStatusMessage("Google sign-in will be connected in a later step.");
  }

  /** Event handler. Checks the fields, then saves the email and opens the portal. */
  function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    setStatusMessage("");

    const nextEmailError = isValidEmailAddress(emailAddress) ? "" : "Enter a valid email address.";
    const nextPasswordError = passwordValue.trim() ? "" : "Enter your password.";
    const nextRobotError = robotConfirmed ? "" : "Confirm you are not a robot.";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setRobotError(nextRobotError);

    if (nextEmailError || nextPasswordError || nextRobotError) {
      return;
    }

    const trimmedEmailAddress = emailAddress.trim();
    if (rememberMe) {
      rememberEmailAddress(trimmedEmailAddress);
    } else {
      forgetRememberedEmailAddress();
    }

    saveLodgeSession({ emailAddress: trimmedEmailAddress });
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
        <label className="field-label" htmlFor="email-address">
          Email <span className="required-mark">*</span>
        </label>
        <input
          id="email-address"
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
        fieldId="password"
        label="Password"
        passwordValue={passwordValue}
        autoComplete="current-password"
        onPasswordChange={setPasswordValue}
      />
      {passwordError ? <p className="field-error field-error-offset">{passwordError}</p> : null}

      <label className="remember-row">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(changeEvent) => setRememberMe(changeEvent.target.checked)}
        />
        Remember
      </label>

      <RobotCheck robotConfirmed={robotConfirmed} onRobotConfirmedChange={setRobotConfirmed} />
      {robotError ? <p className="field-error field-error-tight">{robotError}</p> : null}

      <button type="submit" className="primary-button">
        Sign In
      </button>

      <div className="auth-links">
        <Link href="/forgot-password">Forgot password?</Link>
        <p className="auth-prompt">
          Don&apos;t have an account? <Link href="/register">Sign Up</Link>
        </p>
      </div>
    </form>
  );
}
