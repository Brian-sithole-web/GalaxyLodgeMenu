"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { GalaxyLogo } from "@/components/brand/GalaxyLogo";
import { clearLodgeSession } from "@/lib/lodgeSession";

type AdminShellProps = {
  emailAddress: string;
  children: ReactNode;
};

const navigationItems = [
  { href: "/portal", label: "Dashboard", icon: "home" },
  { href: "/portal/menus", label: "Menus", icon: "menu" },
  { href: "/portal/stores", label: "Stores", icon: "store" },
  { href: "/portal/orders", label: "Orders", icon: "orders" },
  { href: "/portal/marketing", label: "Marketing", icon: "marketing" },
  { href: "/portal/reports", label: "Reports", icon: "reports" },
  { href: "/portal/integrations", label: "Integrations", icon: "integrations" },
  { href: "/portal/settings", label: "Settings", icon: "settings" },
] as const;

/**
 * Layout component in src/components/admin.
 * The signed-in workspace: Galaxy Space logo, left navigation, and the top toolbar.
 */
export function AdminShell({ emailAddress, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  /** Event handler. Leaves the admin and returns to the login card. */
  function handleSignOut() {
    clearLodgeSession();
    router.replace("/login");
  }

  const pageTitle = titleForPath(pathname);

  return (
    <div className={darkTheme ? "admin-shell dark" : "admin-shell"}>
      <aside className={sidebarOpen ? "admin-sidebar" : "admin-sidebar collapsed"}>
        <Link href="/portal" className="admin-brand">
          <GalaxyLogo width={168} />
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          {navigationItems.map((navigationItem) => {
            const active =
              navigationItem.href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(navigationItem.href);
            return (
              <Link
                key={navigationItem.href}
                href={navigationItem.href}
                className={active ? "admin-nav-link active" : "admin-nav-link"}
              >
                <NavIcon name={navigationItem.icon} />
                <span>{navigationItem.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="admin-content">
        <header className="admin-toolbar">
          <button
            type="button"
            className="toolbar-icon-button"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((currentlyOpen) => !currentlyOpen)}
          >
            <NavIcon name="bars" />
          </button>
          <h1 className="admin-page-title">{pageTitle}</h1>
          <div className="admin-toolbar-actions">
            <button
              type="button"
              className="toolbar-icon-button"
              aria-label={darkTheme ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDarkTheme((currentlyDark) => !currentlyDark)}
            >
              <NavIcon name={darkTheme ? "sun" : "moon"} />
            </button>
            <span className="admin-email">{emailAddress}</span>
            <button type="button" className="sign-out-button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </header>
        <div className="admin-page">{children}</div>
      </div>
    </div>
  );
}

function titleForPath(pathname: string): string {
  if (pathname.includes("/menu-editor")) {
    return "Menu editor";
  }
  const match = navigationItems.find((navigationItem) =>
    navigationItem.href === "/portal" ? pathname === "/portal" : pathname.startsWith(navigationItem.href),
  );
  return match?.label ?? "Admin";
}

/** Presentational helper. Small line icons for the sidebar and toolbar. */
function NavIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true as const };
  if (name === "bars") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M4 7h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" />
      </svg>
    );
  }
  if (name === "moon") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M14 3a8 8 0 1 0 7 12 7 7 0 1 1-7-12z" />
      </svg>
    );
  }
  if (name === "sun") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path fill="currentColor" d="M11 2h2v3h-2zm0 17h2v3h-2zM2 11h3v2H2zm17 0h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4zM5.6 19.8l-1.4-1.4 2.1-2.1 1.4 1.4zm12.1-12.1 2.1-2.1 1.4 1.4-2.1 2.1z" />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M5 5h14v3H5zm0 5.5h14v3H5zM5 16h9v3H5z" />
      </svg>
    );
  }
  if (name === "store") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M4 9 5.2 4h13.6L20 9v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-4 0zm2 4.2V20h5v-4h2v4h5v-6.8a5 5 0 0 1-2 .8 5 5 0 0 1-4-2 5 5 0 0 1-4 2 5 5 0 0 1-2-.8z" />
      </svg>
    );
  }
  if (name === "orders") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M7 3h10l1 4H6zm-1 6h12l-1 11H7z" />
      </svg>
    );
  }
  if (name === "marketing") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M4 10v4h3l6 4V6L7 10zm12.5 2a3.5 3.5 0 0 0-1.5-2.9v5.8A3.5 3.5 0 0 0 16.5 12z" />
      </svg>
    );
  }
  if (name === "reports") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M5 19h3V10H5zm5.5 0h3V5h-3zm5.5 0h3v-7h-3z" />
      </svg>
    );
  }
  if (name === "integrations") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M8 8a3 3 0 1 1 2.8 3H9v2h1.8a3 3 0 1 1-2.8 3H8v-2h1.8A3 3 0 0 1 8 13v-2H6.2A3 3 0 1 1 8 8z" />
      </svg>
    );
  }
  if (name === "settings") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.2 3-1.6-.5a6.7 6.7 0 0 0-.6-1.4l.8-1.5-1.4-1.4-1.5.8a6.7 6.7 0 0 0-1.4-.6L14 5h-4l-.5 1.6a6.7 6.7 0 0 0-1.4.6l-1.5-.8-1.4 1.4.8 1.5c-.3.4-.5.9-.6 1.4L4 11v2l1.6.5c.1.5.3 1 .6 1.4l-.8 1.5 1.4 1.4 1.5-.8c.4.3.9.5 1.4.6L10 19h4l.5-1.6c.5-.1 1-.3 1.4-.6l1.5.8 1.4-1.4-.8-1.5c.3-.4.5-.9.6-1.4L20 13z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path fill="currentColor" d="M4 10.5 12 4l8 6.5V20h-5v-5H9v5H4z" />
    </svg>
  );
}
