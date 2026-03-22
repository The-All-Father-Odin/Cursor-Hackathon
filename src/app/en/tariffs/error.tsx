"use client";

import RouteErrorPage from "@/components/ui/RouteErrorPage";

export default function EnTariffsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPage
      title="Failed to load tariff calculator"
      body="Something went wrong while loading the tariff and landed-cost page."
      retryLabel="Try again"
      backHref="/en"
      backLabel="Back to Home"
      onRetry={reset}
    />
  );
}
