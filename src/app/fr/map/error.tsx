"use client";

import RouteErrorPage from "@/components/ui/RouteErrorPage";

export default function FrMapError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPage
      title="Impossible de charger la carte"
      body="Une erreur est survenue lors du chargement de la carte des fournisseurs."
      retryLabel="Réessayer"
      backHref="/fr"
      backLabel="Retour à l’accueil"
      onRetry={reset}
    />
  );
}
