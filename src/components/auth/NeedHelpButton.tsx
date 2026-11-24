"use client";

import { useState } from "react";

/**
 * Floating action on the sign-up screen.
 * Same teal pill as the source admin. Chat itself is not wired yet.
 */
export function NeedHelpButton() {
  const [helpOpen, setHelpOpen] = useState(false);

  /** Event handler. Toggles the short help note. */
  function toggleHelpNote() {
    setHelpOpen((currentlyOpen) => !currentlyOpen);
  }

  return (
    <div className="need-help">
      {helpOpen ? (
        <p className="need-help-note">Help chat will be connected in a later step.</p>
      ) : null}
      <button type="button" className="need-help-button" onClick={toggleHelpNote}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
          />
        </svg>
        Need Help?
      </button>
    </div>
  );
}
