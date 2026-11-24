import type { ReactNode } from "react";
import Link from "next/link";
import { GalaxyLogo } from "@/components/brand/GalaxyLogo";

type AuthScreenProps = {
  children: ReactNode;
};

/**
 * Layout component in src/components/auth.
 * Centers the white auth card on the gray page and places the logo
 * above whatever form the page passes in.
 */
export function AuthScreen({ children }: AuthScreenProps) {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-logo">
          <GalaxyLogo />
        </div>
        {children}
      </section>
      <p className="auth-copyright">
        <Link href="/login">© 2026 THE GALAXY SPACE | All Rights Reserved</Link>
      </p>
    </main>
  );
}
