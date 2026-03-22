"use client";

import SupplierErrorPage from "@/components/suppliers/SupplierErrorPage";

export default function EnSupplierError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SupplierErrorPage locale="en" onRetry={reset} />;
}
