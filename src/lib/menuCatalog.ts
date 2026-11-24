const catalogStorageKey = "galaxylodge-menu-catalog";

export const ingredientWarnings = [
  "Gluten free",
  "Dairy free",
  "Egg",
  "Fish",
  "Nuts",
  "Peanut",
  "Sesame",
  "Soy",
  "Vegan",
  "Vegetarian",
  "Spicy",
  "Sugar free",
] as const;

export const itemLabels = ["New", "Bestseller"] as const;
export const serviceModes = ["Dine-in", "Takeaway", "Delivery"] as const;
export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type PriceOption = {
  id: string;
  label: string;
  amount: string;
};

export type ModifierOption = {
  id: string;
  name: string;
  price: string;
};

export type ModifierGroup = {
  id: string;
  name: string;
  requirement: "optional" | "required";
  options: ModifierOption[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  labels: string[];
  serviceModes: string[];
  size: string;
  unit: string;
  prepTimeMinutes: string;
  ingredientWarnings: string[];
  featured: boolean;
  soldOut: boolean;
  visible: boolean;
  prices: PriceOption[];
  modifierGroupIds: string[];
  localizedName: string;
  localizedDescription: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  modifierGroupIds: string[];
  items: MenuItem[];
};

export type LodgeMenu = {
  id: string;
  name: string;
  description: string;
  linkedStoreName: string;
  categories: MenuCategory[];
  modifierGroups: ModifierGroup[];
};

export type MenuCatalog = {
  menus: LodgeMenu[];
  archivedMenus: LodgeMenu[];
};

/** Helper. Builds a short id for menus, categories, items, and prices. */
export function createMenuRecordId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Helper. Shows a stored amount as South African rand. */
export function formatMenuPrice(amount: string): string {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) {
    return amount;
  }
  return `R ${numericAmount.toFixed(2)}`;
}

function createPriceOption(label: string, amount: string): PriceOption {
  return { id: createMenuRecordId(), label, amount };
}

function createMenuItem(details: Omit<MenuItem, "id" | "prices"> & { prices: Array<Omit<PriceOption, "id">> }): MenuItem {
  return {
    ...details,
    id: createMenuRecordId(),
    prices: details.prices.map((price) => createPriceOption(price.label, price.amount)),
  };
}

/** Helper. The first menu a new lodge sees before they add their own. */
function createSeedCatalog(): MenuCatalog {
  const sauceGroupId = createMenuRecordId();
  const sauceGroup: ModifierGroup = {
    id: sauceGroupId,
    name: "Sauce",
    requirement: "optional",
    options: [
      { id: createMenuRecordId(), name: "Pepper", price: "0" },
      { id: createMenuRecordId(), name: "Mushroom", price: "15" },
    ],
  };

  const lodgeMenu: LodgeMenu = {
    id: "galaxy-lodge-menu",
    name: "Galaxy Lodge Menu",
    description: "Breakfast, lodge plates, and drinks for The Galaxy Space.",
    linkedStoreName: "Galaxy Lodge",
    modifierGroups: [sauceGroup],
    categories: [
      {
        id: createMenuRecordId(),
        name: "Starters",
        description: "Small plates to open the meal.",
        visible: true,
        modifierGroupIds: [],
        items: [
          createMenuItem({
            name: "Galaxy salad",
            description: "Leaves, citrus, and toasted seeds.",
            labels: ["New"],
            serviceModes: ["Dine-in", "Takeaway"],
            size: "1",
            unit: "plate",
            prepTimeMinutes: "8",
            ingredientWarnings: ["Vegetarian", "Nuts"],
            featured: true,
            soldOut: false,
            visible: true,
            prices: [{ label: "Regular", amount: "75" }],
            modifierGroupIds: [],
            localizedName: "",
            localizedDescription: "",
          }),
        ],
      },
      {
        id: createMenuRecordId(),
        name: "Lodge plates",
        description: "Main meals from the lodge kitchen.",
        visible: true,
        modifierGroupIds: [sauceGroupId],
        items: [
          createMenuItem({
            name: "Grilled chicken",
            description: "Charred chicken with seasonal vegetables.",
            labels: ["Bestseller"],
            serviceModes: ["Dine-in", "Takeaway", "Delivery"],
            size: "1",
            unit: "plate",
            prepTimeMinutes: "18",
            ingredientWarnings: [],
            featured: true,
            soldOut: false,
            visible: true,
            prices: [
              { label: "Regular", amount: "145" },
              { label: "Large", amount: "175" },
            ],
            modifierGroupIds: [],
            localizedName: "",
            localizedDescription: "",
          }),
        ],
      },
      {
        id: createMenuRecordId(),
        name: "Drinks",
        description: "Coffee and cold drinks.",
        visible: true,
        modifierGroupIds: [],
        items: [
          createMenuItem({
            name: "Lodge coffee",
            description: "Freshly brewed coffee.",
            labels: [],
            serviceModes: ["Dine-in", "Takeaway"],
            size: "1",
            unit: "cup",
            prepTimeMinutes: "4",
            ingredientWarnings: [],
            featured: false,
            soldOut: false,
            visible: true,
            prices: [{ label: "Regular", amount: "35" }],
            modifierGroupIds: [],
            localizedName: "",
            localizedDescription: "",
          }),
        ],
      },
    ],
  };

  return { menus: [lodgeMenu], archivedMenus: [] };
}

/** Helper. Reads the lodge catalog from this browser, or seeds it the first time. */
export function readMenuCatalog(): MenuCatalog {
  if (typeof window === "undefined") {
    return createSeedCatalog();
  }

  const storedCatalog = window.localStorage.getItem(catalogStorageKey);
  if (!storedCatalog) {
    const seedCatalog = createSeedCatalog();
    writeMenuCatalog(seedCatalog);
    return seedCatalog;
  }

  try {
    const parsedCatalog = JSON.parse(storedCatalog) as MenuCatalog;
    if (!Array.isArray(parsedCatalog.menus) || !Array.isArray(parsedCatalog.archivedMenus)) {
      return createSeedCatalog();
    }
    return parsedCatalog;
  } catch {
    return createSeedCatalog();
  }
}

/** Helper. Saves the catalog on this browser only. No server is called. */
export function writeMenuCatalog(catalog: MenuCatalog): void {
  window.localStorage.setItem(catalogStorageKey, JSON.stringify(catalog));
}

function cloneModifierGroup(modifierGroup: ModifierGroup): ModifierGroup {
  return {
    ...modifierGroup,
    id: createMenuRecordId(),
    options: modifierGroup.options.map((option) => ({ ...option, id: createMenuRecordId() })),
  };
}

/** Helper. Copies a menu, including categories, items, and modifier groups, under a new name. */
export function duplicateLodgeMenu(menu: LodgeMenu): LodgeMenu {
  const modifierIdMap = new Map<string, string>();
  const modifierGroups = menu.modifierGroups.map((modifierGroup) => {
    const clonedGroup = cloneModifierGroup(modifierGroup);
    modifierIdMap.set(modifierGroup.id, clonedGroup.id);
    return clonedGroup;
  });

  return {
    ...menu,
    id: createMenuRecordId(),
    name: `${menu.name} copy`,
    linkedStoreName: "",
    modifierGroups,
    categories: menu.categories.map((category) => ({
      ...category,
      id: createMenuRecordId(),
      modifierGroupIds: category.modifierGroupIds.map((modifierGroupId) => modifierIdMap.get(modifierGroupId) ?? modifierGroupId),
      items: category.items.map((item) => ({
        ...item,
        id: createMenuRecordId(),
        modifierGroupIds: item.modifierGroupIds.map((modifierGroupId) => modifierIdMap.get(modifierGroupId) ?? modifierGroupId),
        prices: item.prices.map((price) => ({ ...price, id: createMenuRecordId() })),
      })),
    })),
  };
}

/** Helper. A blank item used by the Add New button in the items column. */
export function createEmptyMenuItem(): MenuItem {
  return {
    id: createMenuRecordId(),
    name: "",
    description: "",
    labels: [],
    serviceModes: ["Dine-in", "Takeaway"],
    size: "",
    unit: "",
    prepTimeMinutes: "",
    ingredientWarnings: [],
    featured: false,
    soldOut: false,
    visible: true,
    prices: [createPriceOption("Regular", "")],
    modifierGroupIds: [],
    localizedName: "",
    localizedDescription: "",
  };
}
