"use client";

import RouteErrorPage from "@/components/ui/RouteErrorPage";

export default function EnMapError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPage
      title="Failed to load map"
      body="Something went wrong while loading the supplier map."
      retryLabel="Try again"
      backHref="/en"
      backLabel="Back to Home"
      onRetry={reset}
    />
  );
}
