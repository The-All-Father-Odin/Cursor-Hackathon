"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { CanadianContentBadge } from "@/components/ui/CanadianContentBadge";
import { useLocale } from "@/hooks/useLocale";
import { useShortlists } from "@/hooks/useShortlists";
import { deserializeShortlist, getShortlistLabel } from "@/lib/shortlists";

export default function ShortlistDetailPage() {
  const { locale, getLocalePath } = useLocale();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { getShortlist, ready } = useShortlists();

  const shortlistId = typeof params.id === "string" ? params.id : "";
  const embeddedShortlist = deserializeShortlist(searchParams.get("data"));
  const shortlist = embeddedShortlist?.id === shortlistId ? embeddedShortlist : getShortlist(shortlistId);
  const title = shortlist ? getShortlistLabel(shortlist, locale) : locale === "fr" ? "Liste introuvable" : "Shortlist not found";

  if (!ready && !embeddedShortlist) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        {locale === "fr" ? "Chargement de la liste…" : "Loading shortlist…"}
      </div>
    );
  }

  if (!shortlist) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-500 mb-6">
          {locale === "fr"
            ? "Cette liste n’est pas disponible sur cet appareil ou le lien est incomplet."
            : "This shortlist is not available on this device or the shared link is incomplete."}
        </p>
        <Link
          href={getLocalePath("/shortlists")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-maple text-white rounded-xl hover:bg-maple-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === "fr" ? "Retour aux listes" : "Back to shortlists"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href={getLocalePath("/shortlists")}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {locale === "fr" ? "Retour aux listes" : "Back to shortlists"}
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{getShortlistLabel(shortlist, locale)}</h1>
        <p className="text-slate-500 mt-2">
          {shortlist.suppliers.length} {locale === "fr" ? "fournisseurs enregistrés" : "saved suppliers"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shortlist.suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3 min-w-0">
              <CanadianContentBadge score={supplier.canadianContentScore} size="sm" />
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 truncate">{supplier.name}</h2>
                <p className="text-sm text-slate-500">
                  {[supplier.city, supplier.provinceCode].filter(Boolean).join(", ")}
                </p>
                {supplier.briefInfo && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{supplier.briefInfo}</p>
                )}
              </div>
            </div>
            <Link
              href={getLocalePath(`/suppliers/${supplier.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {locale === "fr" ? "Profil" : "Profile"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
