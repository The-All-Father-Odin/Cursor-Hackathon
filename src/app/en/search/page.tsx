import type { Metadata } from "next";

import SearchPageContent from "@/components/search/SearchPageContent";
import { buildSearchPageMetadata } from "@/lib/route-metadata";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildSearchPageMetadata("en", await searchParams);
}

export default function SearchPage() {
  return <SearchPageContent />;
}
