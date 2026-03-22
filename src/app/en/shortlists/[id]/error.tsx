"use client";

import ShortlistsErrorPage from "@/components/shortlists/ShortlistsErrorPage";

export default function EnShortlistDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ShortlistsErrorPage locale="en" variant="detail" onRetry={reset} />;
}
