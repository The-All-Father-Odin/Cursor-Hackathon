import type { Metadata } from "next";

import TariffsPageContent from "@/components/tariffs/TariffsPageContent";

export const metadata: Metadata = {
  title: "Tariff & Landed-Cost Context | SourceLocal",
  description:
    "Compare the cost of importing vs. buying Canadian. See when domestic sourcing is already price-competitive after duties.",
  alternates: {
    canonical: "/en/tariffs",
    languages: {
      en: "/en/tariffs",
      fr: "/fr/tariffs",
    },
  },
};

export default function TariffsPage() {
  return <TariffsPageContent />;
}
