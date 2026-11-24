"use client";

import { useState } from "react";

type PasswordFieldProps = {
  fieldId: string;
  label: string;
  passwordValue: string;
  autoComplete: string;
  required?: boolean;
  onPasswordChange: (passwordValue: string) => void;
};

/**
 * Form control in src/components/auth.
 * Password plus the eye button, sharing one outline the way the login card does.
 */
export function PasswordField({
  fieldId,
  label,
  passwordValue,
  autoComplete,
  required = false,
  onPasswordChange,
}: PasswordFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  /** Event handler. Switches the field between hidden and visible text. */
  function togglePasswordVisibility() {
    setPasswordVisible((currentlyVisible) => !currentlyVisible);
  }

  return (
    <div className="field">
      <label className="field-label" htmlFor={fieldId}>
        {label}
        {required ? <span className="required-mark"> *</span> : null}
      </label>
      <div className="password-field">
        <input
          id={fieldId}
          className="password-input"
          type={passwordVisible ? "text" : "password"}
          value={passwordValue}
          autoComplete={autoComplete}
          onChange={(changeEvent) => onPasswordChange(changeEvent.target.value)}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label="toggle password visibility"
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5c5.2 0 8.8 4.4 9.8 6.1a1.7 1.7 0 0 1 0 1.8C20.8 14.6 17.2 19 12 19S3.2 14.6 2.2 12.9a1.7 1.7 0 0 1 0-1.8C3.2 9.4 6.8 5 12 5zm0 2C8.3 7 5.4 10.2 4.4 12 5.4 13.8 8.3 17 12 17s6.6-3.2 7.6-5C18.6 10.2 15.7 7 12 7zm0 2.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3.3 2.3 2 3.6l3.2 3.2C3.4 8.3 2.2 10 1.6 11.1a1.7 1.7 0 0 0 0 1.8C2.6 15.2 6.4 20 12 20c1.8 0 3.4-.5 4.8-1.2l3.6 3.6 1.3-1.3L3.3 2.3zM12 18c-4.2 0-7.2-3.4-8.2-5 .6-.9 1.7-2.4 3.2-3.6l2.1 2.1A2.8 2.8 0 0 0 12 14.8c.3 0 .6 0 .9-.1l1.6 1.6c-.8.4-1.6.7-2.5.7zm8.6-5c-.4.7-1.1 1.6-2 2.5l-1.5-1.5c.5-.6.9-1.3.9-2.2a4 4 0 0 0-4.7-3.9L12 6.6c3.7.2 6.6 3.2 7.6 4.9a1.7 1.7 0 0 1 0 1.5z"
      />
    </svg>
  );
}
