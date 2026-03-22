"use client";

import ShortlistsErrorPage from "@/components/shortlists/ShortlistsErrorPage";

export default function EnShortlistsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ShortlistsErrorPage locale="en" variant="page" onRetry={reset} />;
}
