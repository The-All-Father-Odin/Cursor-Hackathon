import type { Metadata } from "next";

import ShortlistDetailPage from "@/components/shortlists/ShortlistDetailPage";

export const metadata: Metadata = {
  title: "Shared Supplier Shortlist | SourceLocal",
  description:
    "Review a saved shortlist of Canadian suppliers and open each supplier profile for more detail.",
};

export default function EnShortlistDetailPage() {
  return <ShortlistDetailPage />;
}
