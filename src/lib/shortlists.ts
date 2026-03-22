import type { ApiSupplier } from "@/lib/api";
import { deriveCanadianConfidence } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import type { Shortlist, ShortlistSupplier } from "@/types/supplier";

const STORAGE_KEY = "sourcelocal.shortlists.v1";
const DEFAULT_CREATED_AT = new Date(0).toISOString();

export const DEFAULT_SHORTLIST_ID = "default";

function createDefaultShortlist(): Shortlist {
  return {
    id: DEFAULT_SHORTLIST_ID,
    name: "Saved Suppliers",
    suppliers: [],
    createdAt: DEFAULT_CREATED_AT,
  };
}

function ensureDefaultShortlist(shortlists: Shortlist[]): Shortlist[] {
  const sanitized = shortlists
    .filter((shortlist): shortlist is Shortlist =>
      Boolean(shortlist && typeof shortlist.id === "string" && typeof shortlist.name === "string")
    )
    .map((shortlist) => ({
      ...shortlist,
      suppliers: Array.isArray(shortlist.suppliers) ? shortlist.suppliers : [],
      createdAt: shortlist.createdAt || new Date().toISOString(),
    }));

  const defaultShortlist = sanitized.find((shortlist) => shortlist.id === DEFAULT_SHORTLIST_ID);
  if (defaultShortlist) {
    return sanitized.map((shortlist) =>
      shortlist.id === DEFAULT_SHORTLIST_ID
        ? { ...shortlist, createdAt: shortlist.createdAt || DEFAULT_CREATED_AT }
        : shortlist
    );
  }

  return [createDefaultShortlist(), ...sanitized];
}

function generateShortlistId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `shortlist-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function encodeBase64Url(value: string): string {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window
      .btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  return value;
}

function decodeBase64Url(value: string): string {
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    return decodeURIComponent(escape(window.atob(padded)));
  }

  return value;
}

export function readStoredShortlists(): Shortlist[] {
  if (typeof window === "undefined") {
    return [createDefaultShortlist()];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createDefaultShortlist()];

    const parsed = JSON.parse(raw) as Shortlist[];
    return ensureDefaultShortlist(parsed);
  } catch {
    return [createDefaultShortlist()];
  }
}

export function writeStoredShortlists(shortlists: Shortlist[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ensureDefaultShortlist(shortlists)));
}

export function createShortlist(shortlists: Shortlist[], name: string): Shortlist[] {
  const trimmedName = name.trim();
  if (!trimmedName) return ensureDefaultShortlist(shortlists);

  return ensureDefaultShortlist([
    ...shortlists,
    {
      id: generateShortlistId(),
      name: trimmedName,
      suppliers: [],
      createdAt: new Date().toISOString(),
    },
  ]);
}

export function deleteShortlist(shortlists: Shortlist[], shortlistId: string): Shortlist[] {
  if (shortlistId === DEFAULT_SHORTLIST_ID) return ensureDefaultShortlist(shortlists);
  return ensureDefaultShortlist(shortlists.filter((shortlist) => shortlist.id !== shortlistId));
}

export function removeSupplierFromShortlist(
  shortlists: Shortlist[],
  shortlistId: string,
  supplierId: string
): Shortlist[] {
  return ensureDefaultShortlist(
    shortlists.map((shortlist) =>
      shortlist.id === shortlistId
        ? {
            ...shortlist,
            suppliers: shortlist.suppliers.filter((supplier) => supplier.id !== supplierId),
          }
        : shortlist
    )
  );
}

export function toggleSupplierInShortlist(
  shortlists: Shortlist[],
  shortlistId: string,
  supplier: ShortlistSupplier
): Shortlist[] {
  const nextShortlists = ensureDefaultShortlist(shortlists).map((shortlist) => {
    if (shortlist.id !== shortlistId) return shortlist;

    const exists = shortlist.suppliers.some((entry) => entry.id === supplier.id);
    return {
      ...shortlist,
      suppliers: exists
        ? shortlist.suppliers.filter((entry) => entry.id !== supplier.id)
        : [...shortlist.suppliers, supplier],
    };
  });

  return ensureDefaultShortlist(nextShortlists);
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

export function getShortlistLabel(shortlist: Shortlist, locale: Locale): string {
  if (shortlist.id === DEFAULT_SHORTLIST_ID) {
    return locale === "fr" ? "Fournisseurs sauvegardés" : "Saved Suppliers";
  }

  return shortlist.name;
}

export function serializeShortlist(shortlist: Shortlist): string {
  return encodeBase64Url(JSON.stringify(shortlist));
}

export function deserializeShortlist(value: string | null): Shortlist | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeBase64Url(value)) as Shortlist;
    const [shortlist] = ensureDefaultShortlist([parsed]).filter((entry) => entry.id === parsed.id);
    return shortlist ?? null;
  } catch {
    return null;
  }
}
