import type { Metadata } from "next";

import ShortlistDetailPage from "@/components/shortlists/ShortlistDetailPage";

export const metadata: Metadata = {
  title: "Liste partagée de fournisseurs | SourceLocal",
  description:
    "Consultez une liste enregistrée de fournisseurs canadiens et ouvrez chaque profil pour plus de détails.",
};

export default function FrShortlistDetailPage() {
  return <ShortlistDetailPage />;
}
