"use client";

import SupplierErrorPage from "@/components/suppliers/SupplierErrorPage";

export default function FrSupplierError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SupplierErrorPage locale="fr" onRetry={reset} />;
}
