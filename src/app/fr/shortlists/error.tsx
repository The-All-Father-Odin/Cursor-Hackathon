"use client";

import ShortlistsErrorPage from "@/components/shortlists/ShortlistsErrorPage";

export default function FrShortlistsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ShortlistsErrorPage locale="fr" variant="page" onRetry={reset} />;
}
