import { ApiSupplier, deriveCanadianConfidence } from "@/lib/api";
import { Locale } from "@/lib/i18n";
import { Shortlist, ShortlistSupplier } from "@/types/supplier";

const STORAGE_KEY = "sourcelocal-shortlists-v1";

export const DEFAULT_SHORTLIST_ID = "saved-suppliers";

function createDefaultShortlist(): Shortlist {
  return {
    id: DEFAULT_SHORTLIST_ID,
    name: "Saved Suppliers",
    suppliers: [],
    createdAt: new Date(0).toISOString(),
  };
}

export function getDefaultShortlistLabel(locale: Locale) {
  return locale === "fr" ? "Fournisseurs enregistrés" : "Saved Suppliers";
}

export function getShortlistLabel(shortlist: Shortlist, locale: Locale) {
  if (shortlist.id === DEFAULT_SHORTLIST_ID) {
    return getDefaultShortlistLabel(locale);
  }

  return shortlist.name;
}

export function shortlistSupplierFromApi(supplier: ApiSupplier): ShortlistSupplier {
  return {
    id: supplier.supplier_id,
    name: supplier.business_name,
    city: supplier.city,
    provinceCode: supplier.province_code,
    briefInfo: supplier.brief_info,
    capacityTier: supplier.capacity_tier,
    sourceProvider: supplier.source_provider,
    canadianContentScore: deriveCanadianConfidence(supplier).score,
  };
}

export function normalizeShortlists(value: unknown): Shortlist[] {
  if (!Array.isArray(value)) {
    return [createDefaultShortlist()];
  }

  const normalized = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;

      const shortlist = entry as Partial<Shortlist>;
      if (typeof shortlist.id !== "string" || typeof shortlist.name !== "string" || typeof shortlist.createdAt !== "string") {
        return null;
      }

      const suppliers = Array.isArray(shortlist.suppliers)
        ? shortlist.suppliers.filter(
            (supplier): supplier is ShortlistSupplier =>
              Boolean(supplier) &&
              typeof supplier === "object" &&
              typeof supplier.id === "string" &&
              typeof supplier.name === "string" &&
              typeof supplier.canadianContentScore === "number"
          )
        : [];

      return {
        id: shortlist.id,
        name: shortlist.name,
        createdAt: shortlist.createdAt,
        suppliers,
      };
    })
    .filter((shortlist): shortlist is Shortlist => shortlist !== null);

  if (!normalized.some((shortlist) => shortlist.id === DEFAULT_SHORTLIST_ID)) {
    normalized.unshift(createDefaultShortlist());
  }

  return normalized;
}

export function readStoredShortlists(): Shortlist[] {
  if (typeof window === "undefined") {
    return [createDefaultShortlist()];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createDefaultShortlist()];
    return normalizeShortlists(JSON.parse(raw));
  } catch {
    return [createDefaultShortlist()];
  }
}

export function writeStoredShortlists(shortlists: Shortlist[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeShortlists(shortlists)));
}

export function createShortlist(shortlists: Shortlist[], name: string): Shortlist[] {
  const trimmed = name.trim();
  if (!trimmed) return shortlists;

  return [
    ...shortlists,
    {
      id: `sl-${Date.now()}`,
      name: trimmed,
      suppliers: [],
      createdAt: new Date().toISOString(),
    },
  ];
}

export function deleteShortlist(shortlists: Shortlist[], id: string): Shortlist[] {
  if (id === DEFAULT_SHORTLIST_ID) {
    return shortlists.map((shortlist) =>
      shortlist.id === DEFAULT_SHORTLIST_ID ? { ...shortlist, suppliers: [] } : shortlist
    );
  }

  return shortlists.filter((shortlist) => shortlist.id !== id);
}

export function removeSupplierFromShortlist(shortlists: Shortlist[], shortlistId: string, supplierId: string): Shortlist[] {
  return shortlists.map((shortlist) =>
    shortlist.id === shortlistId
      ? {
          ...shortlist,
          suppliers: shortlist.suppliers.filter((supplier) => supplier.id !== supplierId),
        }
      : shortlist
  );
}

export function toggleSupplierInShortlist(
  shortlists: Shortlist[],
  shortlistId: string,
  supplier: ShortlistSupplier
): Shortlist[] {
  return shortlists.map((shortlist) => {
    if (shortlist.id !== shortlistId) return shortlist;

    const exists = shortlist.suppliers.some((entry) => entry.id === supplier.id);

    return {
      ...shortlist,
      suppliers: exists
        ? shortlist.suppliers.filter((entry) => entry.id !== supplier.id)
        : [supplier, ...shortlist.suppliers],
    };
  });
}

export function serializeShortlist(shortlist: Shortlist) {
  return JSON.stringify(shortlist);
}

export function deserializeShortlist(value: string | null): Shortlist | null {
  if (!value) return null;

  try {
    return normalizeShortlists([JSON.parse(value)])[0] ?? null;
  } catch {
    return null;
  }
}
