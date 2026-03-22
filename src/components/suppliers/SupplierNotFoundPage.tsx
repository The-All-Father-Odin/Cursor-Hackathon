"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { getSupplierReturnTarget } from "@/lib/navigation";

type SupplierNotFoundPageProps = {
  locale: "en" | "fr";
};

export default function SupplierNotFoundPage({ locale }: SupplierNotFoundPageProps) {
  const searchParams = useSearchParams();
  const returnTarget = getSupplierReturnTarget(searchParams.get("returnTo"));
  const href = `/${locale}${returnTarget.href}`;

  const copy =
    locale === "fr"
      ? {
          title: "Fournisseur introuvable",
          body: "Ce profil de fournisseur canadien est introuvable.",
          backToSearch: "Retour à la recherche",
          backToHome: "Retour à l’accueil",
          backToMap: "Retour à la carte",
          backToShortlists: "Retour aux listes",
        }
      : {
          title: "Supplier Not Found",
          body: "This Canadian supplier profile could not be found.",
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
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 bg-maple text-white rounded-xl hover:bg-maple-dark transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>
    </div>
  );
}
