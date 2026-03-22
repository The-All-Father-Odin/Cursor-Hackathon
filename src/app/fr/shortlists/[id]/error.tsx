"use client";

import ShortlistsErrorPage from "@/components/shortlists/ShortlistsErrorPage";

export default function FrShortlistDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ShortlistsErrorPage locale="fr" variant="detail" onRetry={reset} />;
}
