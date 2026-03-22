import type { Metadata } from "next";

import MapPage from "@/components/map/MapPage";

export const metadata: Metadata = {
  title: "Carte des fournisseurs canadiens | SourceLocal",
  description:
    "Explorez les fournisseurs canadiens sur une carte interactive avec filtres provinciaux, liens partageables et vues ciblées.",
  alternates: {
    canonical: "/fr/map",
    languages: {
      en: "/en/map",
      fr: "/fr/map",
    },
  },
};

export default function FrMapPage() {
  return <MapPage />;
}
