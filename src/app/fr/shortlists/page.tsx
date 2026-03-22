import type { Metadata } from "next";

import { ShortlistsPage } from "@/components/shortlists/ShortlistsPage";

export const metadata: Metadata = {
  title: "Mes listes de fournisseurs | SourceLocal",
  description:
    "Enregistrez des fournisseurs canadiens dans des listes réutilisables, exportez-les en CSV et partagez-les avec votre équipe.",
  alternates: {
    canonical: "/fr/shortlists",
    languages: {
      en: "/en/shortlists",
      fr: "/fr/shortlists",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FrShortlistsPage() {
  return <ShortlistsPage />;
}
