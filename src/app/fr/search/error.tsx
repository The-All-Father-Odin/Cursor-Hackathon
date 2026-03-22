"use client";

import RouteErrorPage from "@/components/ui/RouteErrorPage";

export default function FrSearchError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPage
      title="Impossible de charger la recherche"
      body="Une erreur est survenue lors du chargement de la page de recherche des fournisseurs."
      retryLabel="Réessayer"
      backHref="/fr"
      backLabel="Retour à l’accueil"
      onRetry={reset}
    />
  );
}
