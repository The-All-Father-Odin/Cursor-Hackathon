"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { getSupplierReturnTarget } from "@/lib/navigation";

type SupplierErrorPageProps = {
  locale: "en" | "fr";
  onRetry: () => void;
};

export default function SupplierErrorPage({
  locale,
  onRetry,
}: SupplierErrorPageProps) {
  const searchParams = useSearchParams();
  const returnTarget = getSupplierReturnTarget(searchParams.get("returnTo"));
  const href = `/${locale}${returnTarget.href}`;

  const copy =
    locale === "fr"
      ? {
          title: "Impossible de charger le fournisseur",
          body: "Une erreur est survenue lors du chargement de ce profil de fournisseur.",
          retry: "Réessayer",
          backToSearch: "Retour à la recherche",
          backToHome: "Retour à l’accueil",
          backToMap: "Retour à la carte",
          backToShortlists: "Retour aux listes",
        }
      : {
          title: "Failed to load supplier",
          body: "Something went wrong while loading this supplier profile.",
          retry: "Try again",
          backToSearch: "Back to Search",
          backToHome: "Back to Home",
          backToMap: "Back to Map",
          backToShortlists: "Back to Shortlists",
        };

  const backLabel =
    returnTarget.kind === "home"
      ? copy.backToHome
      : returnTarget.kind === "map"
      ? copy.backToMap
      : returnTarget.kind === "shortlists"
      ? copy.backToShortlists
      : copy.backToSearch;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{copy.title}</h1>
      <p className="text-slate-500 mb-6">{copy.body}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-maple text-white rounded-xl hover:bg-maple-dark transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {copy.retry}
        </button>
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
