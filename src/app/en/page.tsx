import type { Metadata } from "next";

import { LandingPage } from "@/components/LandingPage";

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
};

export default function EnHomePage() {
  return <LandingPage />;
}
