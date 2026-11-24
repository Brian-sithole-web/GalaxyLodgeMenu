"use client";

import { useState } from "react";
import type { ModifierGroup, ModifierOption, LodgeMenu } from "@/lib/menuCatalog";
import { createMenuRecordId } from "@/lib/menuCatalog";

type ModifierEditorProps = {
  menu: LodgeMenu;
  onMenuChange: (menu: LodgeMenu) => void;
};

/**
 * Form section in src/components/menus.
 * Edits add-on groups for one menu. Item-level groups override these on a single dish.
 */
export function ModifierEditor({ menu, onMenuChange }: ModifierEditorProps) {
  const [groupName, setGroupName] = useState("");
  const [requirement, setRequirement] = useState<"optional" | "required">("optional");
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [draftOptions, setDraftOptions] = useState<ModifierOption[]>([]);

  /** Event handler. Adds one priced choice to the group being created. */
  function addDraftOption() {
    if (!optionName.trim()) {
      return;
    }
    setDraftOptions((currentOptions) => [
      ...currentOptions,
      { id: createMenuRecordId(), name: optionName.trim(), price: optionPrice || "0" },
    ]);
    setOptionName("");
    setOptionPrice("");
  }

  /** Event handler. Saves the new modifier group onto this menu. */
  function saveModifierGroup() {
    if (!groupName.trim() || draftOptions.length === 0) {
      return;
    }
    const modifierGroup: ModifierGroup = {
      id: createMenuRecordId(),
      name: groupName.trim(),
      requirement,
      options: draftOptions,
    };
    onMenuChange({ ...menu, modifierGroups: [...menu.modifierGroups, modifierGroup] });
    setGroupName("");
    setRequirement("optional");
    setDraftOptions([]);
  }

  /** Event handler. Removes a modifier group from the menu and from any category or item using it. */
  function deleteModifierGroup(modifierGroupId: string) {
    onMenuChange({
      ...menu,
      modifierGroups: menu.modifierGroups.filter((modifierGroup) => modifierGroup.id !== modifierGroupId),
      categories: menu.categories.map((category) => ({
        ...category,
        modifierGroupIds: category.modifierGroupIds.filter((id) => id !== modifierGroupId),
        items: category.items.map((item) => ({
          ...item,
          modifierGroupIds: item.modifierGroupIds.filter((id) => id !== modifierGroupId),
        })),
      })),
    });
  }

  return (
    <div className="modifier-editor">
      <ul className="modifier-list">
        {menu.modifierGroups.length === 0 ? <li className="empty-row">No modifier groups yet.</li> : null}
        {menu.modifierGroups.map((modifierGroup) => (
          <li key={modifierGroup.id} className="modifier-card">
            <div>
              <strong>{modifierGroup.name}</strong>
              <span className="muted-label">{modifierGroup.requirement}</span>
              <p>
                {modifierGroup.options
                  .map((option) => `${option.name} (R ${option.price})`)
                  .join(", ")}
              </p>
            </div>
            <button type="button" className="text-button danger" onClick={() => deleteModifierGroup(modifierGroup.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="stack-form">
        <h3>Add modifier group</h3>
        <label className="field-label" htmlFor={`modifier-name-${menu.id}`}>
          Group name
        </label>
        <input
          id={`modifier-name-${menu.id}`}
          className="field-input"
          value={groupName}
          onChange={(changeEvent) => setGroupName(changeEvent.target.value)}
        />
        <label className="field-label" htmlFor={`modifier-requirement-${menu.id}`}>
          Requirement
        </label>
        <select
          id={`modifier-requirement-${menu.id}`}
          className="field-input"
          value={requirement}
          onChange={(changeEvent) => setRequirement(changeEvent.target.value as "optional" | "required")}
        >
          <option value="optional">Optional</option>
          <option value="required">Required</option>
        </select>
        <div className="inline-fields">
          <input
            className="field-input"
            placeholder="Option name"
            value={optionName}
            onChange={(changeEvent) => setOptionName(changeEvent.target.value)}
          />
          <input
            className="field-input"
            placeholder="Price"
            value={optionPrice}
            onChange={(changeEvent) => setOptionPrice(changeEvent.target.value)}
          />
          <button type="button" className="secondary-button" onClick={addDraftOption}>
            Add option
          </button>
        </div>
        {draftOptions.length > 0 ? (
          <p className="muted-label">{draftOptions.map((option) => option.name).join(", ")}</p>
        ) : null}
        <button type="button" className="primary-button narrow" onClick={saveModifierGroup}>
          Save group
        </button>
      </div>
    </div>
  );
}
