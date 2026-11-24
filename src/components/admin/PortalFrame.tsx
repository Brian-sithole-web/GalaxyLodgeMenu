"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { readLodgeSession } from "@/lib/lodgeSession";

type PortalFrameProps = {
  children: ReactNode;
};

/**
 * Layout component in src/components/admin.
 * Blocks the workspace until this browser tab has a signed-in email.
 */
export function PortalFrame({ children }: PortalFrameProps) {
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

  if (!emailAddress) {
    return <main className="portal-screen" />;
  }

  return <AdminShell emailAddress={emailAddress}>{children}</AdminShell>;
}
