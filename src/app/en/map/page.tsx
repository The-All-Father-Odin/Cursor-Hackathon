import type { Metadata } from "next";

import MapPage from "@/components/map/MapPage";

export const metadata: Metadata = {
  title: "Canadian Supplier Map | SourceLocal",
  description:
    "Explore Canadian suppliers on an interactive map with province filters, shared deep links, and focused supplier views.",
  alternates: {
    canonical: "/en/map",
    languages: {
      en: "/en/map",
      fr: "/fr/map",
    },
  },
};

export default function EnMapPage() {
  return <MapPage />;
}
