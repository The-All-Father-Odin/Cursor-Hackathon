import type { FreightQuote } from "@/types/tariff";

export type TariffLocale = "en" | "fr";

export function normalizeTariffLocale(locale?: string | null): TariffLocale {
  return locale?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function getTariffMessages(locale: TariffLocale) {
  if (locale === "fr") {
    return {
      enterHsCode: "Entrez un code SH.",
      selectOriginCountry: "Sélectionnez un pays d'origine.",
      enterValidInvoiceValue: "Entrez une valeur de facture valide.",
      enterAtLeastSixDigitHsCode: "Entrez au moins un code SH à 6 chiffres.",
      noCbsaMatch: (hsCodeInput: string) => `Aucun poste tarifaire de l'ASFC ne correspond à ${hsCodeInput}.`,
      ambiguousHsCode: "Le code SH est ambigu. Choisissez un poste tarifaire plus précis.",
      tariffLookupFailed: "La recherche tarifaire a échoué.",
      tariffEstimateFailed: "Le calcul tarifaire a échoué.",
      complexRateWarning: (rateText: string) =>
        `Ce tarif utilise une formule complexe (${rateText}). Le calculateur ne peut pas encore dériver un montant de droits précis.`,
      matchingSuppliersFound: (count: number) =>
        `${count.toLocaleString("fr-CA")} fournisseurs correspondants trouvés dans l'annuaire SourceLocal pour cette recherche produit.`,
      addProductNameNote:
        "Ajoutez un nom de produit pour estimer aussi combien de fournisseurs canadiens correspondants existent dans l'annuaire SourceLocal.",
      sourceLocalSupplierDirectory: "Annuaire de fournisseurs SourceLocal",
      manualInputSource: "saisie manuelle",
      fedexMissingFieldsSource: "devis colis FedEx (champs d'expédition manquants)",
      fedexMissingFieldsWarning:
        "Le mode devis colis exige un code postal d'origine, un code postal de destination, un pays d'origine et un poids de colis avant de pouvoir demander un devis transporteur.",
      fedexNotConfiguredSource: "adaptateur de devis colis FedEx non configuré",
      fedexNotConfiguredWarning:
        "Le mode devis colis FedEx est prêt, mais FEDEX_CLIENT_ID, FEDEX_CLIENT_SECRET et FEDEX_ACCOUNT_NUMBER ne sont pas encore configurés. Le fret a été fixé à 0 CAD.",
      fedexQuoteFailedSource: "échec du devis colis FedEx",
      fedexQuoteFailedWarning:
        "Le devis colis FedEx a échoué, donc le fret a été fixé à 0 CAD.",
      fedexQuoteFailedWithStatus: (status: string) =>
        `Le devis colis FedEx a échoué (HTTP ${status}), donc le fret a été fixé à 0 CAD.`,
      freightAdapterSource: "adaptateur de devis fret non configuré",
      freightAdapterWarning:
        "Le mode devis fret est préparé, mais aucun fournisseur de fret externe n'est encore configuré. Le fret a été fixé à 0 CAD.",
      unknownShipmentModeSource: "mode d'expédition inconnu",
      unknownShipmentModeWarning:
        "Mode d'expédition inconnu. Le fret a été fixé à 0 CAD.",
      freeRate: "En franchise",
    };
  }

  return {
    enterHsCode: "Enter an HS code.",
    selectOriginCountry: "Select an origin country.",
    enterValidInvoiceValue: "Enter a valid invoice value.",
    enterAtLeastSixDigitHsCode: "Enter at least a 6-digit HS code.",
    noCbsaMatch: (hsCodeInput: string) => `No CBSA tariff item match found for ${hsCodeInput}.`,
    ambiguousHsCode: "The HS code is ambiguous. Pick a more specific tariff item.",
    tariffLookupFailed: "Tariff lookup failed.",
    tariffEstimateFailed: "Tariff estimate failed.",
    complexRateWarning: (rateText: string) =>
      `This tariff uses a complex rate formula (${rateText}). The calculator cannot derive a precise duty amount yet.`,
    matchingSuppliersFound: (count: number) =>
      `Found ${count.toLocaleString("en-CA")} matching suppliers in the SourceLocal directory for this product query.`,
    addProductNameNote:
      "Add a product name to also estimate how many matching Canadian suppliers exist in the SourceLocal directory.",
    sourceLocalSupplierDirectory: "SourceLocal supplier directory",
    manualInputSource: "manual input",
    fedexMissingFieldsSource: "FedEx parcel quote (missing shipment fields)",
    fedexMissingFieldsWarning:
      "Parcel quote mode needs origin postal code, destination postal code, origin country, and parcel weight before a carrier quote can run.",
    fedexNotConfiguredSource: "FedEx parcel quote adapter not configured",
    fedexNotConfiguredWarning:
      "FedEx parcel quote mode is ready, but FEDEX_CLIENT_ID, FEDEX_CLIENT_SECRET, and FEDEX_ACCOUNT_NUMBER are not configured yet. Freight was set to 0 CAD.",
    fedexQuoteFailedSource: "FedEx parcel quote failed",
    fedexQuoteFailedWarning: "FedEx parcel quote failed, so freight was set to 0 CAD.",
    fedexQuoteFailedWithStatus: (status: string) =>
      `FedEx parcel quote failed (HTTP ${status}), so freight was set to 0 CAD.`,
    freightAdapterSource: "freight quote adapter not configured",
    freightAdapterWarning:
      "Freight quote mode is scaffolded but no external freight provider is configured yet. Freight was set to 0 CAD.",
    unknownShipmentModeSource: "unknown shipment mode",
    unknownShipmentModeWarning: "Unknown shipment mode. Freight was set to 0 CAD.",
    freeRate: "Free",
  };
}

export function localizeTariffRateText(rateText: string, locale: TariffLocale) {
  if (/^free$/i.test(rateText)) {
    return getTariffMessages(locale).freeRate;
  }

  return rateText;
}

export function localizeTariffError(error: string, locale: TariffLocale) {
  const copy = getTariffMessages(locale);

  if (error === "Enter an HS code.") return copy.enterHsCode;
  if (error === "Select an origin country.") return copy.selectOriginCountry;
  if (error === "Enter a valid invoice value.") return copy.enterValidInvoiceValue;
  if (error === "Enter at least a 6-digit HS code.") return copy.enterAtLeastSixDigitHsCode;
  if (error === "The HS code is ambiguous. Pick a more specific tariff item.") return copy.ambiguousHsCode;
  if (error === "Tariff lookup failed.") return copy.tariffLookupFailed;
  if (error === "Tariff estimate failed.") return copy.tariffEstimateFailed;

  const noMatch = error.match(/^No CBSA tariff item match found for (.+)\.$/);
  if (noMatch) {
    return copy.noCbsaMatch(noMatch[1]);
  }

  return error;
}

export function getTariffEstimateMessages(locale: TariffLocale) {
  const copy = getTariffMessages(locale);

  return {
    ...copy,
    invalidRequest: {
      enterHsCode: copy.enterHsCode,
      selectOriginCountry: copy.selectOriginCountry,
      enterValidInvoiceValue: copy.enterValidInvoiceValue,
    },
  };
}

export function localizeFreightQuote(quote: FreightQuote, locale: TariffLocale): FreightQuote {
  const copy = getTariffMessages(locale);

  const warnings = quote.warnings.map((warning) => {
    if (warning === "Parcel quote mode needs origin postal code, destination postal code, origin country, and parcel weight before a carrier quote can run.") {
      return copy.fedexMissingFieldsWarning;
    }

    if (warning === "FedEx parcel quote mode is ready, but FEDEX_CLIENT_ID, FEDEX_CLIENT_SECRET, and FEDEX_ACCOUNT_NUMBER are not configured yet. Freight was set to 0 CAD.") {
      return copy.fedexNotConfiguredWarning;
    }

    if (warning === "FedEx parcel quote failed, so freight was set to 0 CAD.") {
      return copy.fedexQuoteFailedWarning;
    }

    const fedexStatus = warning.match(/^FedEx (?:auth|rate quote) failed: (\d+)$/);
    if (fedexStatus) {
      return copy.fedexQuoteFailedWithStatus(fedexStatus[1]);
    }

    if (
      warning === "Missing FedEx API credentials." ||
      warning === "Missing FedEx account number." ||
      warning === "FedEx auth response did not include an access token." ||
      warning === "FedEx rate response did not include a parsable quote."
    ) {
      return copy.fedexQuoteFailedWarning;
    }

    if (warning === "Freight quote mode is scaffolded but no external freight provider is configured yet. Freight was set to 0 CAD.") {
      return copy.freightAdapterWarning;
    }

    if (warning === "Unknown shipment mode. Freight was set to 0 CAD.") {
      return copy.unknownShipmentModeWarning;
    }

    return warning;
  });

  const source =
    quote.source === "manual input"
      ? copy.manualInputSource
      : quote.source === "FedEx parcel quote (missing shipment fields)"
        ? copy.fedexMissingFieldsSource
        : quote.source === "FedEx parcel quote adapter not configured"
          ? copy.fedexNotConfiguredSource
          : quote.source === "FedEx parcel quote failed"
            ? copy.fedexQuoteFailedSource
            : quote.source === "freight quote adapter not configured"
              ? copy.freightAdapterSource
              : quote.source === "unknown shipment mode"
                ? copy.unknownShipmentModeSource
                : quote.source;

  return {
    ...quote,
    source,
    warnings,
  };
}
