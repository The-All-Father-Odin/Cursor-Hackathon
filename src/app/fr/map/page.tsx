import type { Metadata } from "next";

import MapPage from "@/components/map/MapPage";
import { buildMapPageMetadata } from "@/lib/route-metadata";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildMapPageMetadata("fr", await searchParams);
}

export default function FrMapPage() {
  return <MapPage />;
}
