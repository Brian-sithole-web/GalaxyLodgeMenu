"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GalaxyLogo } from "@/components/brand/GalaxyLogo";
import { ItemDialog } from "@/components/menus/ItemDialog";
import { ModifierEditor } from "@/components/menus/ModifierEditor";
import {
  createEmptyMenuItem,
  createMenuRecordId,
  formatMenuPrice,
  readMenuCatalog,
  writeMenuCatalog,
  type LodgeMenu,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menuCatalog";

type EditorTab = "menu" | "modifiers" | "preview";

/**
 * Client screen in src/components/menus.
 * Categories on the left, items on the right, matching the menu editor.
 */
export function MenuEditor() {
  const params = useParams<{ menuId: string }>();
  const menuId = params.menuId;
  const [menu, setMenu] = useState<LodgeMenu | null>(null);
  const [missingMenu, setMissingMenu] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editorTab, setEditorTab] = useState<EditorTab>("menu");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryModifierIds, setCategoryModifierIds] = useState<string[]>([]);
  const [itemDialog, setItemDialog] = useState<MenuItem | null>(null);
  const [openRowMenuId, setOpenRowMenuId] = useState("");
  const [draggedCategoryId, setDraggedCategoryId] = useState("");
  const [draggedItemId, setDraggedItemId] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const catalog = readMenuCatalog();
    const foundMenu = catalog.menus.find((currentMenu) => currentMenu.id === menuId);
    if (!foundMenu) {
      setMissingMenu(true);
      return;
    }
    setMenu(foundMenu);
    setSelectedCategoryId(foundMenu.categories[0]?.id ?? "");
  }, [menuId]);

  function persistMenu(nextMenu: LodgeMenu) {
    const catalog = readMenuCatalog();
    writeMenuCatalog({
      ...catalog,
      menus: catalog.menus.map((currentMenu) => (currentMenu.id === nextMenu.id ? nextMenu : currentMenu)),
    });
    setMenu(nextMenu);
  }

  const selectedCategory = menu?.categories.find((category) => category.id === selectedCategoryId) ?? null;

  function openNewCategory() {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryModifierIds([]);
    setFormError("");
    setCategoryDialogOpen(true);
  }

  function openEditCategory(category: MenuCategory) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setCategoryModifierIds(category.modifierGroupIds);
    setFormError("");
    setCategoryDialogOpen(true);
    setOpenRowMenuId("");
  }

  /** Event handler. Creates or updates a category, then keeps it selected. */
  function saveCategory() {
    if (!menu || !categoryName.trim()) {
      setFormError("Enter a category name.");
      return;
    }
    if (editingCategory) {
      const categories = menu.categories.map((category) =>
        category.id === editingCategory.id
          ? {
              ...category,
              name: categoryName.trim(),
              description: categoryDescription.trim(),
              modifierGroupIds: categoryModifierIds,
            }
          : category,
      );
      persistMenu({ ...menu, categories });
    } else {
      const category: MenuCategory = {
        id: createMenuRecordId(),
        name: categoryName.trim(),
        description: categoryDescription.trim(),
        visible: true,
        modifierGroupIds: categoryModifierIds,
        items: [],
      };
      persistMenu({ ...menu, categories: [...menu.categories, category] });
      setSelectedCategoryId(category.id);
    }
    setCategoryDialogOpen(false);
  }

  function deleteCategory(categoryId: string) {
    if (!menu) {
      return;
    }
    const categories = menu.categories.filter((category) => category.id !== categoryId);
    persistMenu({ ...menu, categories });
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(categories[0]?.id ?? "");
    }
    setOpenRowMenuId("");
  }

  function toggleCategoryVisibility(category: MenuCategory) {
    if (!menu) {
      return;
    }
    persistMenu({
      ...menu,
      categories: menu.categories.map((currentCategory) =>
        currentCategory.id === category.id ? { ...currentCategory, visible: !currentCategory.visible } : currentCategory,
      ),
    });
    setOpenRowMenuId("");
  }

  /** Event handler. Reorders categories when one row is dropped on another. */
  function dropCategory(targetCategoryId: string) {
    if (!menu || !draggedCategoryId || draggedCategoryId === targetCategoryId) {
      return;
    }
    const categories = [...menu.categories];
    const fromIndex = categories.findIndex((category) => category.id === draggedCategoryId);
    const toIndex = categories.findIndex((category) => category.id === targetCategoryId);
    const [movedCategory] = categories.splice(fromIndex, 1);
    categories.splice(toIndex, 0, movedCategory);
    persistMenu({ ...menu, categories });
    setDraggedCategoryId("");
  }

  function dropItem(targetItemId: string) {
    if (!menu || !selectedCategory || !draggedItemId || draggedItemId === targetItemId) {
      return;
    }
    const items = [...selectedCategory.items];
    const fromIndex = items.findIndex((item) => item.id === draggedItemId);
    const toIndex = items.findIndex((item) => item.id === targetItemId);
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    persistMenu({
      ...menu,
      categories: menu.categories.map((category) =>
        category.id === selectedCategory.id ? { ...category, items } : category,
      ),
    });
    setDraggedItemId("");
  }

  /** Event handler. Writes a new or edited dish into the selected category. */
  function saveItem(item: MenuItem) {
    if (!menu || !selectedCategory) {
      return;
    }
    const alreadyExists = selectedCategory.items.some((currentItem) => currentItem.id === item.id);
    const items = alreadyExists
      ? selectedCategory.items.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
      : [...selectedCategory.items, item];
    persistMenu({
      ...menu,
      categories: menu.categories.map((category) =>
        category.id === selectedCategory.id ? { ...category, items } : category,
      ),
    });
    setItemDialog(null);
  }

  function deleteItem(itemId: string) {
    if (!menu || !selectedCategory) {
      return;
    }
    persistMenu({
      ...menu,
      categories: menu.categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, items: category.items.filter((item) => item.id !== itemId) }
          : category,
      ),
    });
    setOpenRowMenuId("");
  }

  if (missingMenu) {
    return (
      <section className="admin-panel">
        <h2>Menu not found</h2>
        <p>That menu is not in this browser&apos;s catalog.</p>
        <Link href="/portal/menus">Back to menus</Link>
      </section>
    );
  }

  if (!menu) {
    return <section className="admin-panel" />;
  }

  return (
    <section className="menu-editor">
      <div className="workspace-heading">
        <div>
          <Link href="/portal/menus" className="back-link">
            Menus
          </Link>
          <h2 className="editor-title">{menu.name}</h2>
          <p className="muted-label">{menu.description}</p>
        </div>
        <div className="workspace-actions">
          <div className="tab-row">
            <button
              type="button"
              className={editorTab === "menu" ? "tab-button active" : "tab-button"}
              onClick={() => setEditorTab("menu")}
            >
              Menu
            </button>
            <button
              type="button"
              className={editorTab === "modifiers" ? "tab-button active" : "tab-button"}
              onClick={() => setEditorTab("modifiers")}
            >
              Modifiers
            </button>
          </div>
          <button type="button" className="secondary-button" onClick={() => setEditorTab("preview")}>
            Preview
          </button>
        </div>
      </div>

      {editorTab === "menu" ? (
        <div className="editor-columns">
          <section className="editor-column">
            <header className="column-header">
              <h3>Categories</h3>
              <button type="button" className="icon-button" aria-label="Add category" onClick={openNewCategory}>
                +
              </button>
            </header>
            <ul className="editor-list">
              {menu.categories.length === 0 ? <li className="empty-row">Add a category to start this menu.</li> : null}
              {menu.categories.map((category) => (
                <li
                  key={category.id}
                  className={category.id === selectedCategoryId ? "editor-row selected" : "editor-row"}
                  draggable
                  onDragStart={() => setDraggedCategoryId(category.id)}
                  onDragOver={(dragEvent) => dragEvent.preventDefault()}
                  onDrop={() => dropCategory(category.id)}
                >
                  <button type="button" className="drag-handle" aria-label="Drag to reorder">
                    ⋮⋮
                  </button>
                  <button type="button" className="row-main" onClick={() => setSelectedCategoryId(category.id)}>
                    <strong>{category.name}</strong>
                    <span>{category.visible ? `${category.items.length} items` : "Hidden"}</span>
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Actions for ${category.name}`}
                    onClick={() => setOpenRowMenuId(openRowMenuId === category.id ? "" : category.id)}
                  >
                    ⋮
                  </button>
                  {openRowMenuId === category.id ? (
                    <div className="action-menu">
                      <button type="button" onClick={() => openEditCategory(category)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => toggleCategoryVisibility(category)}>
                        {category.visible ? "Hide" : "Show"}
                      </button>
                      <button type="button" onClick={() => deleteCategory(category.id)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="editor-column">
            <header className="column-header">
              <h3>Items</h3>
              <button
                type="button"
                className="secondary-button"
                disabled={!selectedCategory}
                onClick={() => setItemDialog(createEmptyMenuItem())}
              >
                + Add New
              </button>
            </header>
            {!selectedCategory ? <p className="empty-row">Select a category.</p> : null}
            <ul className="editor-list">
              {selectedCategory?.items.map((item) => (
                <li
                  key={item.id}
                  className="editor-row"
                  draggable
                  onDragStart={() => setDraggedItemId(item.id)}
                  onDragOver={(dragEvent) => dragEvent.preventDefault()}
                  onDrop={() => dropItem(item.id)}
                >
                  <button type="button" className="drag-handle" aria-label="Drag to reorder">
                    ⋮⋮
                  </button>
                  <button type="button" className="row-main" onClick={() => setItemDialog(item)}>
                    <strong>
                      {item.name}
                      {item.soldOut ? <em className="sold-out-tag">Sold out</em> : null}
                      {item.featured ? <em className="featured-tag">Featured</em> : null}
                    </strong>
                    <span>{item.prices.map((price) => `${price.label} ${formatMenuPrice(price.amount)}`).join(" · ")}</span>
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Actions for ${item.name}`}
                    onClick={() => setOpenRowMenuId(openRowMenuId === item.id ? "" : item.id)}
                  >
                    ⋮
                  </button>
                  {openRowMenuId === item.id ? (
                    <div className="action-menu">
                      <button type="button" onClick={() => setItemDialog(item)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteItem(item.id)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {editorTab === "modifiers" ? (
        <section className="admin-panel">
          <ModifierEditor menu={menu} onMenuChange={persistMenu} />
        </section>
      ) : null}

      {editorTab === "preview" ? (
        <section className="preview-sheet">
          <GalaxyLogo width={180} />
          <h2>{menu.name}</h2>
          <p>{menu.description}</p>
          {menu.categories
            .filter((category) => category.visible)
            .map((category) => (
              <div key={category.id}>
                <h3>{category.name}</h3>
                <p className="muted-label">{category.description}</p>
                <ul className="preview-items">
                  {category.items
                    .filter((item) => item.visible)
                    .map((item) => (
                      <li key={item.id}>
                        <div>
                          <strong>{item.localizedName || item.name}</strong>
                          {item.soldOut ? <em className="sold-out-tag">Sold out</em> : null}
                          <p>{item.localizedDescription || item.description}</p>
                        </div>
                        <span>{formatMenuPrice(item.prices[0]?.amount ?? "")}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </section>
      ) : null}

      {categoryDialogOpen ? (
        <div className="dialog-backdrop" role="presentation">
          <section className="dialog-card" role="dialog" aria-labelledby="category-dialog-title">
            <header className="dialog-header">
              <h2 id="category-dialog-title">{editingCategory ? "Edit category" : "Add category"}</h2>
            </header>
            <div className="dialog-body">
              <label className="field-label" htmlFor="category-name">
                Name <span className="required-mark">*</span>
              </label>
              <input
                id="category-name"
                className="field-input"
                value={categoryName}
                onChange={(changeEvent) => setCategoryName(changeEvent.target.value)}
              />
              <label className="field-label" htmlFor="category-description">
                Description
              </label>
              <textarea
                id="category-description"
                className="field-input field-textarea"
                value={categoryDescription}
                onChange={(changeEvent) => setCategoryDescription(changeEvent.target.value)}
              />
              <p className="field-label">Modifier groups for every item in this category</p>
              {menu.modifierGroups.map((modifierGroup) => (
                <label key={modifierGroup.id} className="remember-row">
                  <input
                    type="checkbox"
                    checked={categoryModifierIds.includes(modifierGroup.id)}
                    onChange={() =>
                      setCategoryModifierIds((currentIds) =>
                        currentIds.includes(modifierGroup.id)
                          ? currentIds.filter((id) => id !== modifierGroup.id)
                          : [...currentIds, modifierGroup.id],
                      )
                    }
                  />
                  {modifierGroup.name}
                </label>
              ))}
              {formError ? <p className="field-error">{formError}</p> : null}
            </div>
            <footer className="dialog-footer">
              <button type="button" className="text-button" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button narrow" onClick={saveCategory}>
                Save
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {itemDialog ? (
        <ItemDialog
          item={itemDialog}
          modifierGroups={menu.modifierGroups}
          onCancel={() => setItemDialog(null)}
          onSave={saveItem}
        />
      ) : null}
    </section>
  );
}
