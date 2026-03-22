import type { Metadata } from "next";

import { ShortlistsPage } from "@/components/shortlists/ShortlistsPage";

export const metadata: Metadata = {
  title: "My Supplier Shortlists | SourceLocal",
  description:
    "Save Canadian suppliers to reusable shortlists, export them to CSV, and share them with your team.",
  alternates: {
    canonical: "/en/shortlists",
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

export default function EnShortlistsPage() {
  return <ShortlistsPage />;
}
