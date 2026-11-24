"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GalaxyLogo } from "@/components/brand/GalaxyLogo";
import { clearLodgeSession, readLodgeSession } from "@/lib/lodgeSession";

/**
 * Client screen in src/components/portal.
 * Shows the logo in the workspace header after sign-in.
 * Sends the visitor back to login when this tab has no session.
 */
export function PortalHome() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");

  useEffect(() => {
    const session = readLodgeSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setEmailAddress(session.emailAddress);
  }, [router]);

  /** Event handler. Drops the tab session and returns to the login card. */
  function handleSignOut() {
    clearLodgeSession();
    router.replace("/login");
  }

  if (!emailAddress) {
    return <main className="portal-screen" />;
  }

  return (
    <main className="portal-screen">
      <header className="portal-header">
        <GalaxyLogo width={190} />
        <div className="portal-header-actions">
          <span>{emailAddress}</span>
          <button type="button" className="sign-out-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>
      <section className="portal-panel">
        <h1>Admin home</h1>
        <p>You are signed in. Menus, tables, and orders are the next pieces of this workspace.</p>
      </section>
    </main>
  );
}
