import type { Metadata } from "next";

import SearchPageContent from "@/components/search/SearchPageContent";

export const metadata: Metadata = {
  title: "Rechercher des fournisseurs canadiens | SourceLocal",
  description:
    "Recherchez plus de 50 000 fournisseurs canadiens par produit, province, secteur et capacité.",
  alternates: {
    canonical: "/fr/search",
    languages: {
      en: "/en/search",
      fr: "/fr/search",
    },
  },
};

export default function SearchPage() {
  return <SearchPageContent />;
}
