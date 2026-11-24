"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModifierEditor } from "@/components/menus/ModifierEditor";
import {
  duplicateLodgeMenu,
  readMenuCatalog,
  writeMenuCatalog,
  createMenuRecordId,
  type LodgeMenu,
  type MenuCatalog,
} from "@/lib/menuCatalog";

type MenuBoardTab = "menus" | "modifiers" | "archive";

/**
 * Client screen in src/components/menus.
 * The Menus area: menu cards, modifier groups, and the archive.
 */
export function MenuBoard() {
  const [catalog, setCatalog] = useState<MenuCatalog | null>(null);
  const [activeTab, setActiveTab] = useState<MenuBoardTab>("menus");
  const [creatingMenu, setCreatingMenu] = useState(false);
  const [editingMenu, setEditingMenu] = useState<LodgeMenu | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setCatalog(readMenuCatalog());
  }, []);

  function saveCatalog(nextCatalog: MenuCatalog) {
    writeMenuCatalog(nextCatalog);
    setCatalog(nextCatalog);
  }

  /** Event handler. Creates a menu from a name and description. */
  function handleCreateMenu() {
    if (!menuName.trim() || !catalog) {
      setFormError("Enter a menu name.");
      return;
    }
    const lodgeMenu: LodgeMenu = {
      id: createMenuRecordId(),
      name: menuName.trim(),
      description: menuDescription.trim(),
      linkedStoreName: "",
      categories: [],
      modifierGroups: [],
    };
    saveCatalog({ ...catalog, menus: [lodgeMenu, ...catalog.menus] });
    setCreatingMenu(false);
    setMenuName("");
    setMenuDescription("");
    setFormError("");
  }

  /** Event handler. Updates the name and description of an existing menu. */
  function handleSaveMenuDetails() {
    if (!catalog || !editingMenu || !menuName.trim()) {
      setFormError("Enter a menu name.");
      return;
    }
    saveCatalog({
      ...catalog,
      menus: catalog.menus.map((menu) =>
        menu.id === editingMenu.id
          ? { ...menu, name: menuName.trim(), description: menuDescription.trim() }
          : menu,
      ),
    });
    setEditingMenu(null);
    setFormError("");
  }

  /** Event handler. Copies a menu into a new card. */
  function handleDuplicate(menu: LodgeMenu) {
    if (!catalog) {
      return;
    }
    saveCatalog({ ...catalog, menus: [duplicateLodgeMenu(menu), ...catalog.menus] });
    setOpenActionMenuId("");
  }

  /** Event handler. Moves a menu into the archive. */
  function handleArchive(menu: LodgeMenu) {
    if (!catalog) {
      return;
    }
    saveCatalog({
      menus: catalog.menus.filter((currentMenu) => currentMenu.id !== menu.id),
      archivedMenus: [menu, ...catalog.archivedMenus],
    });
    setOpenActionMenuId("");
  }

  /** Event handler. Puts an archived menu back on the menu list. */
  function handleRestore(menu: LodgeMenu) {
    if (!catalog) {
      return;
    }
    saveCatalog({
      menus: [menu, ...catalog.menus],
      archivedMenus: catalog.archivedMenus.filter((currentMenu) => currentMenu.id !== menu.id),
    });
  }

  function openEdit(menu: LodgeMenu) {
    setEditingMenu(menu);
    setMenuName(menu.name);
    setMenuDescription(menu.description);
    setOpenActionMenuId("");
    setFormError("");
  }

  if (!catalog) {
    return <section className="admin-panel" />;
  }

  return (
    <section className="menu-workspace">
      <div className="workspace-heading">
        <div className="tab-row" role="tablist">
          {(
            [
              ["menus", "Menus"],
              ["modifiers", "Modifiers"],
              ["archive", "Archive"],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "tab-button active" : "tab-button"}
              onClick={() => setActiveTab(tab)}
            >
              {label}
            </button>
          ))}
        </div>
        {activeTab === "menus" ? (
          <button
            type="button"
            className="primary-button narrow"
            onClick={() => {
              setCreatingMenu(true);
              setMenuName("");
              setMenuDescription("");
              setFormError("");
            }}
          >
            + Add New
          </button>
        ) : null}
      </div>

      {activeTab === "menus" ? (
        <div className="menu-card-grid">
          {catalog.menus.map((menu) => (
            <article key={menu.id} className="menu-summary-card">
              <div className="menu-summary-top">
                <div>
                  <h2>{menu.name}</h2>
                  <p>{menu.description || "No description yet."}</p>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Actions for ${menu.name}`}
                  onClick={() => setOpenActionMenuId(openActionMenuId === menu.id ? "" : menu.id)}
                >
                  ⋮
                </button>
                {openActionMenuId === menu.id ? (
                  <div className="action-menu">
                    <button type="button" onClick={() => openEdit(menu)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDuplicate(menu)}>
                      Duplicate
                    </button>
                    <button type="button" onClick={() => handleArchive(menu)}>
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="muted-label">
                {menu.categories.length} categories · {menu.categories.reduce((count, category) => count + category.items.length, 0)} items
              </p>
              {menu.linkedStoreName ? <span className="connected-tag">Connected · {menu.linkedStoreName}</span> : null}
              <Link className="secondary-button" href={`/portal/menus/${menu.id}/menu-editor`}>
                Open editor
              </Link>
            </article>
          ))}
        </div>
      ) : null}

      {activeTab === "modifiers" ? (
        <div className="stack-gap">
          {catalog.menus.map((menu) => (
            <section key={menu.id} className="admin-panel">
              <h2>{menu.name}</h2>
              <ModifierEditor
                menu={menu}
                onMenuChange={(updatedMenu) =>
                  saveCatalog({
                    ...catalog,
                    menus: catalog.menus.map((currentMenu) =>
                      currentMenu.id === updatedMenu.id ? updatedMenu : currentMenu,
                    ),
                  })
                }
              />
            </section>
          ))}
        </div>
      ) : null}

      {activeTab === "archive" ? (
        <div className="menu-card-grid">
          {catalog.archivedMenus.length === 0 ? <p className="muted-label">No archived menus.</p> : null}
          {catalog.archivedMenus.map((menu) => (
            <article key={menu.id} className="menu-summary-card">
              <h2>{menu.name}</h2>
              <p>{menu.description}</p>
              <button type="button" className="secondary-button" onClick={() => handleRestore(menu)}>
                Restore
              </button>
            </article>
          ))}
        </div>
      ) : null}

      {creatingMenu || editingMenu ? (
        <div className="dialog-backdrop" role="presentation">
          <section className="dialog-card" role="dialog" aria-labelledby="menu-dialog-title">
            <header className="dialog-header">
              <h2 id="menu-dialog-title">{editingMenu ? "Edit menu" : "Start from scratch"}</h2>
            </header>
            <div className="dialog-body">
              {!editingMenu ? (
                <p className="muted-label">Excel import will be added later. Enter the menu by hand for now.</p>
              ) : null}
              <label className="field-label" htmlFor="menu-name">
                Menu name <span className="required-mark">*</span>
              </label>
              <input
                id="menu-name"
                className="field-input"
                value={menuName}
                onChange={(changeEvent) => setMenuName(changeEvent.target.value)}
              />
              <label className="field-label" htmlFor="menu-description">
                Description
              </label>
              <textarea
                id="menu-description"
                className="field-input field-textarea"
                value={menuDescription}
                onChange={(changeEvent) => setMenuDescription(changeEvent.target.value)}
              />
              {formError ? <p className="field-error">{formError}</p> : null}
            </div>
            <footer className="dialog-footer">
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setCreatingMenu(false);
                  setEditingMenu(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button narrow"
                onClick={editingMenu ? handleSaveMenuDetails : handleCreateMenu}
              >
                Save
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </section>
  );
}
