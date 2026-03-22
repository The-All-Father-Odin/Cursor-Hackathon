import type { Metadata } from "next";

import SearchPageContent from "@/components/search/SearchPageContent";

export const metadata: Metadata = {
  title: "Search Canadian Suppliers | SourceLocal",
  description:
    "Search 50,000+ Canadian suppliers by product, province, industry, and capacity.",
  alternates: {
    canonical: "/en/search",
    languages: {
      en: "/en/search",
      fr: "/fr/search",
    },
  },
};

export default function SearchPage() {
  return <SearchPageContent />;
}
