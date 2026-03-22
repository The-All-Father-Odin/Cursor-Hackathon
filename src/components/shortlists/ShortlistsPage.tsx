"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Download,
  Share2,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Bookmark,
  Search,
  ExternalLink,
} from "lucide-react";
import { CanadianContentBadge } from "@/components/ui/CanadianContentBadge";
import { useLocale } from "@/hooks/useLocale";
import { useShortlists } from "@/hooks/useShortlists";
import { DEFAULT_SHORTLIST_ID, getShortlistLabel, serializeShortlist } from "@/lib/shortlists";

function exportCSV(locale: "en" | "fr", shortlistName: string, suppliers: Array<{
  id: string;
  name: string;
  city?: string | null;
  provinceCode?: string | null;
  canadianContentScore: number;
  capacityTier?: string | null;
  sourceProvider?: string | null;
}>) {
  const headers =
    locale === "fr"
      ? ["Nom", "Ville", "Province", "Score canadien", "Capacité", "Source"]
      : ["Name", "City", "Province", "Canadian Content Score", "Capacity", "Source"];

  const rows = suppliers.map((supplier) => [
    supplier.name,
    supplier.city ?? "",
    supplier.provinceCode ?? "",
    supplier.canadianContentScore,
    supplier.capacityTier ?? "",
    supplier.sourceProvider ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${shortlistName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ShortlistsPage() {
  const { t, locale, getLocalePath } = useLocale();
  const labels =
    locale === "fr"
      ? {
          lists: "listes",
          delete: "Supprimer",
          emptyShortlist: "Aucun fournisseur dans cette liste pour l’instant.",
          shortlistName: "Nom de la liste",
          shortlistPlaceholder: "ex. Fournisseurs emballage T3",
          create: "Créer",
          loading: "Chargement des listes…",
          copyLink: "Lien copié",
        }
      : {
          lists: "lists",
          delete: "Delete",
          emptyShortlist: "No suppliers in this list yet.",
          shortlistName: "Shortlist name",
          shortlistPlaceholder: "e.g. Q3 Packaging Vendors",
          create: "Create",
          loading: "Loading shortlists…",
          copyLink: "Link copied",
        };

  const { shortlists, ready, createShortlist, deleteShortlist, removeSupplier } = useShortlists();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([DEFAULT_SHORTLIST_ID]));
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasMeaningfulShortlists = shortlists.some(
    (shortlist) => shortlist.id !== DEFAULT_SHORTLIST_ID || shortlist.suppliers.length > 0
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateShortlist = () => {
    if (!newName.trim()) return;
    createShortlist(newName);
    setNewName("");
    setModalOpen(false);
  };

  const handleShareShortlist = async (id: string) => {
    const shortlist = shortlists.find((entry) => entry.id === id);
    if (!shortlist) return;

    const url = new URL(getLocalePath(`/shortlists/${shortlist.id}`), window.location.origin);
    url.searchParams.set("data", serializeShortlist(shortlist));

    await navigator.clipboard.writeText(url.toString()).catch(() => {});
    setCopiedId(shortlist.id);
    window.setTimeout(() => setCopiedId((current) => (current === shortlist.id ? null : current)), 2000);
  };

  if (!ready) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        {labels.loading}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("shortlist.title")}</h1>
          <p className="text-slate-500 mt-1">
            {shortlists.length} {labels.lists}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-maple)] text-white rounded-lg font-medium hover:bg-[var(--color-maple-dark)] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t("shortlist.create")}
        </button>
      </div>

      {!hasMeaningfulShortlists && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <Bookmark className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-lg text-slate-600 max-w-sm">{t("shortlist.empty")}</p>
          <Link
            href={getLocalePath("/search")}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[var(--color-maple)] text-white rounded-lg font-medium hover:bg-[var(--color-maple-dark)] transition-colors"
          >
            <Search className="w-4 h-4" />
            {t("nav.search")}
          </Link>
        </div>
      )}

      {hasMeaningfulShortlists && (
        <div className="flex flex-col gap-4">
          {shortlists.map((shortlist, idx) => {
            const isExpanded = expandedIds.has(shortlist.id);
            const displayName = getShortlistLabel(shortlist, locale);
            const staggerClass = `stagger-${Math.min(idx + 1, 5)}`;

            return (
              <div
                key={shortlist.id}
                className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow animate-fade-in-up ${staggerClass}`}
              >
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-bold text-slate-900 truncate">{displayName}</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {shortlist.suppliers.length} {t("shortlist.suppliers")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {new Date(shortlist.createdAt).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleExpand(shortlist.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => exportCSV(locale, displayName, shortlist.suppliers)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t("shortlist.export")}
                    </button>
                    <button
                      onClick={() => handleShareShortlist(shortlist.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {copiedId === shortlist.id ? labels.copyLink : t("shortlist.share")}
                    </button>
                    <button
                      onClick={() => deleteShortlist(shortlist.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {labels.delete}
                    </button>
                  </div>
                </div>

                {isExpanded && shortlist.suppliers.length > 0 && (
                  <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shortlist.suppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          className="bg-white rounded-lg border border-slate-100 px-4 py-3 flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CanadianContentBadge score={supplier.canadianContentScore} size="sm" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{supplier.name}</p>
                              <p className="text-xs text-slate-500">
                                {[supplier.city, supplier.provinceCode].filter(Boolean).join(", ")}
                              </p>
                              {supplier.sourceProvider && (
                                <p className="text-[11px] text-slate-400 mt-0.5">{supplier.sourceProvider}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Link
                              href={getLocalePath(`/suppliers/${supplier.id}`)}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              aria-label={locale === "fr" ? "Voir le profil" : "View profile"}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => removeSupplier(shortlist.id, supplier.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              aria-label={locale === "fr" ? "Retirer le fournisseur" : "Remove supplier"}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && shortlist.suppliers.length === 0 && (
                  <div className="border-t border-slate-100 px-6 py-8 bg-slate-50/50 text-center">
                    <p className="text-sm text-slate-400 mb-2">{labels.emptyShortlist}</p>
                    <Link
                      href={getLocalePath("/search")}
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--color-maple)] hover:underline"
                    >
                      <Search className="w-3.5 h-3.5" />
                      {t("nav.search")}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
              setNewName("");
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">{t("shortlist.create")}</h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setNewName("");
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label={t("common.close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-2">{labels.shortlistName}</label>
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleCreateShortlist()}
              placeholder={labels.shortlistPlaceholder}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-maple)] focus:border-transparent"
              autoFocus
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setNewName("");
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleCreateShortlist}
                disabled={!newName.trim()}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-maple)] rounded-lg hover:bg-[var(--color-maple-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {labels.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
