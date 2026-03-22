"use client";

import RouteErrorPage from "@/components/ui/RouteErrorPage";

export default function EnSearchError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPage
      title="Failed to load search"
      body="Something went wrong while loading the supplier search page."
      retryLabel="Try again"
      backHref="/en"
      backLabel="Back to Home"
      onRetry={reset}
    />
  );
}
