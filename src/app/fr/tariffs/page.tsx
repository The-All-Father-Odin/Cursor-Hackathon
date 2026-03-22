import type { Metadata } from "next";

import TariffsPageContent from "@/components/tariffs/TariffsPageContent";
import { buildTariffsPageMetadata } from "@/lib/route-metadata";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildTariffsPageMetadata("fr", await searchParams);
}

export default function TariffsPageFr() {
  return <TariffsPageContent />;
}
