import type { Metadata } from "next";

import { LandingPage } from "@/components/LandingPage";
import { buildSocialMetadata } from "@/lib/route-metadata";
import { buildHomeStructuredData, JsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Find Canadian Suppliers | SourceLocal",
  description:
    "Discover, evaluate, and connect with Canadian suppliers through a bilingual search, map, and tariff-awareness workflow.",
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
  ...buildSocialMetadata(
    "en",
    "Find Canadian Suppliers | SourceLocal",
    "Discover, evaluate, and connect with Canadian suppliers through a bilingual search, map, and tariff-awareness workflow.",
    "/en"
  ),
};

export default function EnHomePage() {
  return (
    <>
      <JsonLdScript data={buildHomeStructuredData("en")} />
      <LandingPage />
    </>
  );
}
