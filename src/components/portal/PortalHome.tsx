"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readMenuCatalog, type MenuCatalog } from "@/lib/menuCatalog";

/**
 * Client screen in src/components/portal.
 * The first page inside the admin. Counts come from the menu catalog saved in this browser.
 */
export function PortalHome() {
  const [catalog, setCatalog] = useState<MenuCatalog | null>(null);

  useEffect(() => {
    setCatalog(readMenuCatalog());
  }, []);

  const menuCount = catalog?.menus.length ?? 0;
  const categoryCount = catalog?.menus.reduce((count, menu) => count + menu.categories.length, 0) ?? 0;
  const itemCount =
    catalog?.menus.reduce(
      (count, menu) => count + menu.categories.reduce((itemTotal, category) => itemTotal + category.items.length, 0),
      0,
    ) ?? 0;
  const firstMenu = catalog?.menus[0];

  return (
    <section className="dashboard">
      <div className="metric-grid">
        <article className="metric-card">
          <span>Menus</span>
          <strong>{menuCount}</strong>
        </article>
        <article className="metric-card">
          <span>Categories</span>
          <strong>{categoryCount}</strong>
        </article>
        <article className="metric-card">
          <span>Items</span>
          <strong>{itemCount}</strong>
        </article>
        <article className="metric-card">
          <span>Orders</span>
          <strong>0</strong>
        </article>
      </div>
      <section className="admin-panel">
        <h2>Menu editor</h2>
        <p>Categories, dishes, prices, and add-ons for the lodge menu.</p>
        <div className="workspace-actions">
          <Link className="primary-button narrow" href="/portal/menus">
            All menus
          </Link>
          {firstMenu ? (
            <Link className="secondary-button" href={`/portal/menus/${firstMenu.id}/menu-editor`}>
              Open {firstMenu.name}
            </Link>
          ) : null}
        </div>
      </section>
    </section>
  );
}
