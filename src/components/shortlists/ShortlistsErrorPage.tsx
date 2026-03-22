"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

type ShortlistsErrorPageProps = {
  locale: "en" | "fr";
  variant: "page" | "detail";
  onRetry: () => void;
};

export default function ShortlistsErrorPage({
  locale,
  variant,
  onRetry,
}: ShortlistsErrorPageProps) {
  const copy =
    locale === "fr"
      ? variant === "detail"
        ? {
            title: "Impossible de charger la liste",
            body: "Une erreur est survenue lors du chargement de cette liste de fournisseurs.",
            retry: "Réessayer",
            backLabel: "Retour aux listes",
            backHref: "/fr/shortlists",
          }
        : {
            title: "Impossible de charger les listes",
            body: "Une erreur est survenue lors du chargement de vos listes de fournisseurs.",
            retry: "Réessayer",
            backLabel: "Retour à l’accueil",
            backHref: "/fr",
          }
      : variant === "detail"
      ? {
          title: "Failed to load shortlist",
          body: "Something went wrong while loading this supplier shortlist.",
          retry: "Try again",
          backLabel: "Back to shortlists",
          backHref: "/en/shortlists",
        }
      : {
          title: "Failed to load shortlists",
          body: "Something went wrong while loading your supplier shortlists.",
          retry: "Try again",
          backLabel: "Back to Home",
          backHref: "/en",
        };

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
          href={copy.backHref}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {copy.backLabel}
        </Link>
      </div>
    </div>
  );
}
