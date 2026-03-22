"use client";

import RouteErrorPage from "@/components/ui/RouteErrorPage";

export default function FrTariffsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPage
      title="Impossible de charger le calculateur tarifaire"
      body="Une erreur est survenue lors du chargement de la page tarifaire et coût rendu."
      retryLabel="Réessayer"
      backHref="/fr"
      backLabel="Retour à l’accueil"
      onRetry={reset}
    />
  );
}
