"use client";

import { useState } from "react";
import {
  ingredientWarnings,
  itemLabels,
  serviceModes,
  type MenuItem,
  type ModifierGroup,
} from "@/lib/menuCatalog";
import { createMenuRecordId } from "@/lib/menuCatalog";

type ItemDialogProps = {
  item: MenuItem;
  modifierGroups: ModifierGroup[];
  onCancel: () => void;
  onSave: (item: MenuItem) => void;
};

const itemTabs = ["Item information", "Price options", "Modifier options", "Localize"] as const;
type ItemTab = (typeof itemTabs)[number];

/**
 * Dialog in src/components/menus.
 * The four tabs used when a dish is added or edited.
 */
export function ItemDialog({ item, modifierGroups, onCancel, onSave }: ItemDialogProps) {
  const [draftItem, setDraftItem] = useState(item);
  const [activeTab, setActiveTab] = useState<ItemTab>("Item information");
  const [formError, setFormError] = useState("");

  /** Event handler. Keeps the draft item in sync as a field changes. */
  function updateDraftItem(partialItem: Partial<MenuItem>) {
    setDraftItem((currentItem) => ({ ...currentItem, ...partialItem }));
  }

  function toggleValue(values: string[], value: string): string[] {
    return values.includes(value) ? values.filter((current) => current !== value) : [...values, value];
  }

  /** Event handler. Requires a name and at least one price, then returns the dish to the editor. */
  function handleSave() {
    if (!draftItem.name.trim()) {
      setFormError("Enter the item name.");
      setActiveTab("Item information");
      return;
    }
    const pricedOptions = draftItem.prices.filter((price) => price.amount.trim());
    if (pricedOptions.length === 0) {
      setFormError("Add at least one price.");
      setActiveTab("Price options");
      return;
    }
    onSave({ ...draftItem, name: draftItem.name.trim(), prices: pricedOptions });
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="dialog-card wide" role="dialog" aria-labelledby="item-dialog-title">
        <header className="dialog-header">
          <h2 id="item-dialog-title">{item.name ? "Edit item" : "Add item"}</h2>
          <button type="button" className="text-button" onClick={onCancel}>
            Close
          </button>
        </header>
        <div className="tab-row" role="tablist">
          {itemTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={activeTab === tab ? "tab-button active" : "tab-button"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Item information" ? (
          <div className="dialog-body">
            <label className="field-label" htmlFor="item-name">
              Name <span className="required-mark">*</span>
            </label>
            <input
              id="item-name"
              className="field-input"
              value={draftItem.name}
              onChange={(changeEvent) => updateDraftItem({ name: changeEvent.target.value })}
            />
            <label className="field-label" htmlFor="item-description">
              Description
            </label>
            <textarea
              id="item-description"
              className="field-input field-textarea"
              value={draftItem.description}
              onChange={(changeEvent) => updateDraftItem({ description: changeEvent.target.value })}
            />
            <p className="field-label">Labels</p>
            <div className="choice-row">
              {itemLabels.map((label) => (
                <label key={label} className="choice-chip">
                  <input
                    type="checkbox"
                    checked={draftItem.labels.includes(label)}
                    onChange={() => updateDraftItem({ labels: toggleValue(draftItem.labels, label) })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="field-label">Show for</p>
            <div className="choice-row">
              {serviceModes.map((serviceMode) => (
                <label key={serviceMode} className="choice-chip">
                  <input
                    type="checkbox"
                    checked={draftItem.serviceModes.includes(serviceMode)}
                    onChange={() =>
                      updateDraftItem({ serviceModes: toggleValue(draftItem.serviceModes, serviceMode) })
                    }
                  />
                  {serviceMode}
                </label>
              ))}
            </div>
            <div className="inline-fields">
              <input
                className="field-input"
                placeholder="Size"
                value={draftItem.size}
                onChange={(changeEvent) => updateDraftItem({ size: changeEvent.target.value })}
              />
              <input
                className="field-input"
                placeholder="Unit"
                value={draftItem.unit}
                onChange={(changeEvent) => updateDraftItem({ unit: changeEvent.target.value })}
              />
              <input
                className="field-input"
                placeholder="Prep minutes"
                value={draftItem.prepTimeMinutes}
                onChange={(changeEvent) => updateDraftItem({ prepTimeMinutes: changeEvent.target.value })}
              />
            </div>
            <p className="field-label">Ingredient warnings</p>
            <div className="choice-row">
              {ingredientWarnings.map((warning) => (
                <label key={warning} className="choice-chip">
                  <input
                    type="checkbox"
                    checked={draftItem.ingredientWarnings.includes(warning)}
                    onChange={() =>
                      updateDraftItem({
                        ingredientWarnings: toggleValue(draftItem.ingredientWarnings, warning),
                      })
                    }
                  />
                  {warning}
                </label>
              ))}
            </div>
            <label className="remember-row">
              <input
                type="checkbox"
                checked={draftItem.featured}
                onChange={(changeEvent) => updateDraftItem({ featured: changeEvent.target.checked })}
              />
              Featured on the homepage
            </label>
            <label className="remember-row">
              <input
                type="checkbox"
                checked={draftItem.soldOut}
                onChange={(changeEvent) => updateDraftItem({ soldOut: changeEvent.target.checked })}
              />
              Sold out
            </label>
            <label className="remember-row">
              <input
                type="checkbox"
                checked={draftItem.visible}
                onChange={(changeEvent) => updateDraftItem({ visible: changeEvent.target.checked })}
              />
              Visible to guests
            </label>
          </div>
        ) : null}

        {activeTab === "Price options" ? (
          <div className="dialog-body">
            {draftItem.prices.map((price) => (
              <div key={price.id} className="inline-fields">
                <input
                  className="field-input"
                  placeholder="Label"
                  value={price.label}
                  onChange={(changeEvent) =>
                    updateDraftItem({
                      prices: draftItem.prices.map((currentPrice) =>
                        currentPrice.id === price.id ? { ...currentPrice, label: changeEvent.target.value } : currentPrice,
                      ),
                    })
                  }
                />
                <input
                  className="field-input"
                  placeholder="Amount"
                  value={price.amount}
                  onChange={(changeEvent) =>
                    updateDraftItem({
                      prices: draftItem.prices.map((currentPrice) =>
                        currentPrice.id === price.id ? { ...currentPrice, amount: changeEvent.target.value } : currentPrice,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="text-button danger"
                  onClick={() =>
                    updateDraftItem({
                      prices: draftItem.prices.filter((currentPrice) => currentPrice.id !== price.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                updateDraftItem({
                  prices: [...draftItem.prices, { id: createMenuRecordId(), label: "", amount: "" }],
                })
              }
            >
              Add price
            </button>
          </div>
        ) : null}

        {activeTab === "Modifier options" ? (
          <div className="dialog-body">
            <p className="muted-label">
              Choices here replace the modifier groups set on the category.
            </p>
            {modifierGroups.length === 0 ? <p>Create a modifier group first.</p> : null}
            {modifierGroups.map((modifierGroup) => (
              <label key={modifierGroup.id} className="remember-row">
                <input
                  type="checkbox"
                  checked={draftItem.modifierGroupIds.includes(modifierGroup.id)}
                  onChange={() =>
                    updateDraftItem({
                      modifierGroupIds: toggleValue(draftItem.modifierGroupIds, modifierGroup.id),
                    })
                  }
                />
                {modifierGroup.name}
              </label>
            ))}
          </div>
        ) : null}

        {activeTab === "Localize" ? (
          <div className="dialog-body">
            <label className="field-label" htmlFor="localized-name">
              Translated name
            </label>
            <input
              id="localized-name"
              className="field-input"
              value={draftItem.localizedName}
              onChange={(changeEvent) => updateDraftItem({ localizedName: changeEvent.target.value })}
            />
            <label className="field-label" htmlFor="localized-description">
              Translated description
            </label>
            <textarea
              id="localized-description"
              className="field-textarea field-input"
              value={draftItem.localizedDescription}
              onChange={(changeEvent) => updateDraftItem({ localizedDescription: changeEvent.target.value })}
            />
          </div>
        ) : null}

        {formError ? <p className="field-error">{formError}</p> : null}
        <footer className="dialog-footer">
          <button type="button" className="text-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="primary-button narrow" onClick={handleSave}>
            Save
          </button>
        </footer>
      </section>
    </div>
  );
}
