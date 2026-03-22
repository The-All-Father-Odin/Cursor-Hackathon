import type { Metadata } from "next";

import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Trouver des fournisseurs canadiens | SourceLocal",
  description:
    "Découvrez, évaluez et contactez des fournisseurs canadiens grâce à une expérience bilingue de recherche, de cartographie et de comparaison tarifaire.",
  alternates: {
    canonical: "/fr",
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
};

export default function FrHomePage() {
  return <LandingPage />;
}
