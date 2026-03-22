"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Calculator,
  ChevronDown,
  DollarSign,
  Globe,
  Leaf,
  Package,
  Scale,
  Ship,
} from "lucide-react";
import { estimateTariff, lookupTariffItems } from "@/lib/api";
import { useLocale } from "@/hooks/useLocale";
import { ORIGIN_OPTIONS } from "@/lib/tariff/treatments";
import type { TariffEstimateResponse, TariffLookupResponse, TariffMatchCandidate } from "@/types/tariff";
import TariffsPageSkeleton from "@/components/tariffs/TariffsPageSkeleton";

function formatCurrency(amount: number | null, locale: "en" | "fr", unavailable: string) {
  if (amount == null) return unavailable;
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(amount);
}

const CURRENCY_OPTIONS = ["CAD", "USD", "EUR", "CNY", "MXN"];
const SHIPMENT_MODES = new Set(["manual", "parcel", "freight"]);

function getOriginOptionLabel(value: string, locale: "en" | "fr", fallback: string) {
  const labels: Record<string, { en: string; fr: string }> = {
    CN: { en: "China", fr: "Chine" },
    US: { en: "United States", fr: "États-Unis" },
    MX: { en: "Mexico", fr: "Mexique" },
    EU: { en: "European Union", fr: "Union européenne" },
    GB: { en: "United Kingdom", fr: "Royaume-Uni" },
    AU: { en: "Australia", fr: "Australie" },
    NZ: { en: "New Zealand", fr: "Nouvelle-Zélande" },
    JP: { en: "Japan", fr: "Japon" },
    KR: { en: "South Korea", fr: "Corée du Sud" },
    CL: { en: "Chile", fr: "Chili" },
    CO: { en: "Colombia", fr: "Colombie" },
    CR: { en: "Costa Rica", fr: "Costa Rica" },
    IL: { en: "Israel", fr: "Israël" },
    HN: { en: "Honduras", fr: "Honduras" },
    PA: { en: "Panama", fr: "Panama" },
    UA: { en: "Ukraine", fr: "Ukraine" },
    PE: { en: "Peru", fr: "Pérou" },
    SG: { en: "Singapore", fr: "Singapour" },
    VN: { en: "Vietnam", fr: "Vietnam" },
    MY: { en: "Malaysia", fr: "Malaisie" },
    BN: { en: "Brunei", fr: "Brunéi" },
    OTHER: { en: "Other / MFN", fr: "Autre / NPF" },
  };

  return labels[value]?.[locale] ?? fallback;
}

function isShipmentMode(value: string): value is "manual" | "parcel" | "freight" {
  return SHIPMENT_MODES.has(value);
}

function TariffsPageInner() {
  const { locale, t, getLocalePath } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const syncingFromUrlRef = useRef(true);
  const lastEstimatedKeyRef = useRef<string | null>(null);
  const copy = useMemo(
    () =>
      locale === "fr"
        ? {
            heading: "Calculateur tarifaire réel",
            subheading:
              "Utilisez les taux tarifaires de l'ASFC, les taux de change de la Banque du Canada et vos intrants de fret pour estimer le coût rendu importé.",
            disclaimer:
              "Les tarifs et les taux de change proviennent de sources officielles, mais les coûts de fret et les prix canadiens restent des estimations ou des flux à connecter.",
            product: "Produit",
            productPlaceholder: "ex. boulons hexagonaux en acier inoxydable",
            origin: "Pays d'origine",
            hsCode: "Code SH / tarifaire",
            hsPlaceholder: "ex. 7318.15.00",
            invoiceValue: "Valeur de facture",
            invoiceCurrency: "Devise de facture",
            shipmentMode: "Mode d'expédition",
            shipmentModeManual: "Saisie manuelle",
            shipmentModeParcel: "Colis FedEx",
            shipmentModeFreight: "Fret (adaptateur à venir)",
            freightCad: "Fret estimé (CAD)",
            originPostalCode: "Code postal d'origine",
            destinationCountry: "Pays de destination",
            destinationPostalCode: "Code postal de destination",
            parcelWeightKg: "Poids du colis (kg)",
            parcelDimensions: "Dimensions du colis (cm, optionnel)",
            length: "Longueur",
            width: "Largeur",
            height: "Hauteur",
            preference: "Je demande un traitement préférentiel si admissible",
            calculate: "Calculer le coût importé",
            treatment: "Traitement tarifaire",
            rate: "Taux tarifaire",
            source: "Source",
            fx: "Taux de change",
            invoiceCad: "Facture convertie (CAD)",
            duty: "Droits estimés",
            freight: "Fret",
            gst: "TPS estimée",
            total: "Coût rendu importé",
            domestic: "Comparaison canadienne",
            domesticTitle: "Devis fournisseur requis",
            domesticBody:
              "SourceLocal peut trouver des fournisseurs canadiens correspondants, mais aucun flux de prix catalogue en direct n'est encore connecté.",
            supplierMatches: "fournisseurs correspondants trouvés",
            ambiguous: "Choisissez un poste tarifaire plus précis :",
            notes: "Notes",
            warnings: "Avertissements",
            chapter: "Ouvrir la source ASFC",
            calculableFalse:
              "Ce poste tarifaire utilise une formule complexe (par exemple des droits spécifiques par tonne). Le calcul automatique complet n'est pas encore disponible.",
            invalidResult: "Aucun résultat disponible pour cette combinaison.",
            lookupLoading: "Vérification du poste tarifaire de l'ASFC…",
            lookupMatches: "Suggestions ASFC",
            lookupExact: "Correspondance exacte détectée",
            lookupError: "Impossible de prévisualiser ce code tarifaire pour le moment.",
            manualOnly: "La saisie manuelle du fret est le seul mode pris en charge dans cette version.",
            parcelHelp: "Le mode Colis utilise l'adaptateur FedEx lorsque les identifiants API et les détails d'expédition sont fournis.",
            liveInputs: "Les chapitres tarifaires de l'ASFC et les taux de change de la Banque du Canada sont interrogés côté serveur; les prix canadiens restent en mode RFQ / référence.",
            noWarnings: "Aucun avertissement.",
            searchCta: "Trouver des fournisseurs canadiens et demander des devis",
            freightSource: "Source du fret",
            tariffItem: "Poste tarifaire",
            unavailable: "Indisponible",
          }
        : {
            heading: "Live tariff calculator",
            subheading:
              "Use CBSA tariff rates, Bank of Canada FX, and your freight inputs to estimate imported landed cost.",
            disclaimer:
              "Tariffs and FX come from official sources, but freight and Canadian domestic prices still rely on estimates or future integrations.",
            product: "Product",
            productPlaceholder: "e.g. stainless steel hex bolts",
            origin: "Origin country",
            hsCode: "HS / tariff code",
            hsPlaceholder: "e.g. 7318.15.00",
            invoiceValue: "Invoice value",
            invoiceCurrency: "Invoice currency",
            shipmentMode: "Shipment mode",
            shipmentModeManual: "Manual entry",
            shipmentModeParcel: "FedEx parcel",
            shipmentModeFreight: "Freight (adapter coming)",
            freightCad: "Estimated freight (CAD)",
            originPostalCode: "Origin postal code",
            destinationCountry: "Destination country",
            destinationPostalCode: "Destination postal code",
            parcelWeightKg: "Parcel weight (kg)",
            parcelDimensions: "Parcel dimensions (cm, optional)",
            length: "Length",
            width: "Width",
            height: "Height",
            preference: "Claim preferential treatment if eligible",
            calculate: "Calculate imported landed cost",
            treatment: "Tariff treatment",
            rate: "Tariff rate",
            source: "Source",
            fx: "Exchange rate",
            invoiceCad: "Converted invoice (CAD)",
            duty: "Estimated duty",
            freight: "Freight",
            gst: "Estimated GST",
            total: "Imported landed cost",
            domestic: "Canadian comparison",
            domesticTitle: "Supplier quote required",
            domesticBody:
              "SourceLocal can find matching Canadian suppliers, but no live domestic catalog pricing feed is connected yet.",
            supplierMatches: "matching suppliers found",
            ambiguous: "Choose a more specific tariff item:",
            notes: "Notes",
            warnings: "Warnings",
            chapter: "Open CBSA source",
            calculableFalse:
              "This tariff item uses a complex formula (for example, a specific duty per tonne). Full automatic duty calculation is not available yet.",
            invalidResult: "No estimate is available for this combination yet.",
            lookupLoading: "Checking CBSA tariff item…",
            lookupMatches: "CBSA suggestions",
            lookupExact: "Exact match found",
            lookupError: "Unable to preview this tariff code right now.",
            manualOnly: "Manual freight entry is the only implemented shipment mode in this version.",
            parcelHelp: "Parcel mode uses the FedEx adapter when API credentials and shipment details are provided.",
            liveInputs: "CBSA tariff chapters and Bank of Canada FX are queried server-side; domestic pricing still remains RFQ / benchmark only.",
            noWarnings: "No warnings.",
            searchCta: "Find Canadian suppliers and request quotes",
            freightSource: "Freight source",
            tariffItem: "Tariff item",
            unavailable: "Unavailable",
          },
    [locale]
  );

  const [productName, setProductName] = useState("");
  const [originCountry, setOriginCountry] = useState("CN");
  const [hsCode, setHsCode] = useState("");
  const [invoiceValue, setInvoiceValue] = useState("");
  const [invoiceCurrency, setInvoiceCurrency] = useState("USD");
  const [shipmentMode, setShipmentMode] = useState<"manual" | "parcel" | "freight">("manual");
  const [manualFreightCad, setManualFreightCad] = useState("");
  const [originPostalCode, setOriginPostalCode] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("CA");
  const [destinationPostalCode, setDestinationPostalCode] = useState("");
  const [parcelWeightKg, setParcelWeightKg] = useState("");
  const [parcelLengthCm, setParcelLengthCm] = useState("");
  const [parcelWidthCm, setParcelWidthCm] = useState("");
  const [parcelHeightCm, setParcelHeightCm] = useState("");
  const [claimPreference, setClaimPreference] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TariffEstimateResponse | null>(null);
  const [lookupResult, setLookupResult] = useState<TariffLookupResponse | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [estimateRequested, setEstimateRequested] = useState(false);

  const calculationKey = useMemo(
    () =>
      JSON.stringify({
        productName: productName.trim(),
        originCountry,
        hsCode: hsCode.trim(),
        invoiceValue: invoiceValue.trim(),
        invoiceCurrency,
        shipmentMode,
        manualFreightCad: manualFreightCad.trim(),
        originPostalCode: originPostalCode.trim(),
        destinationCountry: destinationCountry.trim(),
        destinationPostalCode: destinationPostalCode.trim(),
        parcelWeightKg: parcelWeightKg.trim(),
        parcelLengthCm: parcelLengthCm.trim(),
        parcelWidthCm: parcelWidthCm.trim(),
        parcelHeightCm: parcelHeightCm.trim(),
        claimPreference,
      }),
    [
      claimPreference,
      destinationCountry,
      destinationPostalCode,
      hsCode,
      invoiceCurrency,
      invoiceValue,
      manualFreightCad,
      originCountry,
      originPostalCode,
      parcelHeightCm,
      parcelLengthCm,
      parcelWeightKg,
      parcelWidthCm,
      productName,
      shipmentMode,
    ]
  );

  const canEstimate =
    hsCode.trim().length > 0 &&
    originCountry.trim().length > 0 &&
    Number.isFinite(Number(invoiceValue)) &&
    Number(invoiceValue) > 0;

  function resetEstimatedResult() {
    lastEstimatedKeyRef.current = null;
    setEstimateRequested(false);
    setResult(null);
  }

  useEffect(() => {
    syncingFromUrlRef.current = true;

    const originParam = searchParams.get("origin") || "CN";
    const nextOriginCountry = ORIGIN_OPTIONS.some((option) => option.value === originParam)
      ? originParam
      : "CN";
    const currencyParam = searchParams.get("currency") || "USD";
    const nextInvoiceCurrency = CURRENCY_OPTIONS.includes(currencyParam)
      ? currencyParam
      : "USD";
    const nextShipmentModeParam = searchParams.get("mode") || "manual";
    const nextShipmentMode = isShipmentMode(nextShipmentModeParam) ? nextShipmentModeParam : "manual";
    const nextDestinationCountry = searchParams.get("destination_country") || "CA";

    setProductName(searchParams.get("product") || "");
    setOriginCountry(nextOriginCountry);
    setHsCode(searchParams.get("hs") || "");
    setInvoiceValue(searchParams.get("invoice_value") || "");
    setInvoiceCurrency(nextInvoiceCurrency);
    setShipmentMode(nextShipmentMode);
    setManualFreightCad(searchParams.get("freight_cad") || "");
    setOriginPostalCode(searchParams.get("origin_postal") || "");
    setDestinationCountry(nextDestinationCountry);
    setDestinationPostalCode(searchParams.get("destination_postal") || "");
    setParcelWeightKg(searchParams.get("parcel_weight_kg") || "");
    setParcelLengthCm(searchParams.get("parcel_length_cm") || "");
    setParcelWidthCm(searchParams.get("parcel_width_cm") || "");
    setParcelHeightCm(searchParams.get("parcel_height_cm") || "");
    setClaimPreference(
      searchParams.get("claim_preference") === "1" ||
      searchParams.get("claim_preference") === "true"
    );
    setEstimateRequested(
      searchParams.get("estimate") === "1" ||
      searchParams.get("estimate") === "true"
    );
    setResult(null);
  }, [searchParams]);

  useEffect(() => {
    if (syncingFromUrlRef.current) {
      syncingFromUrlRef.current = false;
      return;
    }

    const nextParams = new URLSearchParams();
    if (productName) nextParams.set("product", productName);
    if (originCountry !== "CN") nextParams.set("origin", originCountry);
    if (hsCode) nextParams.set("hs", hsCode);
    if (invoiceValue) nextParams.set("invoice_value", invoiceValue);
    if (invoiceCurrency !== "USD") nextParams.set("currency", invoiceCurrency);
    if (shipmentMode !== "manual") nextParams.set("mode", shipmentMode);
    if (manualFreightCad) nextParams.set("freight_cad", manualFreightCad);
    if (originPostalCode) nextParams.set("origin_postal", originPostalCode);
    if (destinationCountry !== "CA") nextParams.set("destination_country", destinationCountry);
    if (destinationPostalCode) nextParams.set("destination_postal", destinationPostalCode);
    if (parcelWeightKg) nextParams.set("parcel_weight_kg", parcelWeightKg);
    if (parcelLengthCm) nextParams.set("parcel_length_cm", parcelLengthCm);
    if (parcelWidthCm) nextParams.set("parcel_width_cm", parcelWidthCm);
    if (parcelHeightCm) nextParams.set("parcel_height_cm", parcelHeightCm);
    if (claimPreference) nextParams.set("claim_preference", "1");
    if (estimateRequested) nextParams.set("estimate", "1");

    const nextQueryString = nextParams.toString();
    const currentQueryString = searchParams.toString();
    const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;
    const currentUrl = currentQueryString ? `${pathname}?${currentQueryString}` : pathname;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    claimPreference,
    destinationCountry,
    destinationPostalCode,
    hsCode,
    invoiceCurrency,
    invoiceValue,
    manualFreightCad,
    originCountry,
    originPostalCode,
    parcelHeightCm,
    parcelLengthCm,
    parcelWeightKg,
    parcelWidthCm,
    pathname,
    productName,
    router,
    searchParams,
    shipmentMode,
    estimateRequested,
  ]);

  useEffect(() => {
    const normalizedHs = hsCode.replace(/\D/g, "");
    if (normalizedHs.length < 6) {
      setLookupResult(null);
      setLookupLoading(false);
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setLookupLoading(true);
      try {
        const response = await lookupTariffItems({
          hs: hsCode,
          originCountry,
          claimPreference,
          locale,
        });
        if (!cancelled) {
          setLookupResult(response);
        }
      } catch {
        if (!cancelled) {
          setLookupResult({
            ok: false,
            error: copy.lookupError,
          });
        }
      } finally {
        if (!cancelled) {
          setLookupLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [claimPreference, copy.lookupError, hsCode, originCountry]);

  useEffect(() => {
    if (!estimateRequested || !canEstimate || loading) {
      return;
    }

    if (lastEstimatedKeyRef.current === calculationKey) {
      return;
    }

    lastEstimatedKeyRef.current = calculationKey;
    void handleCalculate({ persistEstimate: true });
  }, [calculationKey, canEstimate, estimateRequested, loading]);

  async function handleCalculate(options?: { persistEstimate?: boolean }) {
    const persistEstimate = (options?.persistEstimate ?? true) && canEstimate;
    if (persistEstimate) {
      lastEstimatedKeyRef.current = calculationKey;
      setEstimateRequested(true);
    }

    setLoading(true);

    try {
      const response = await estimateTariff({
        locale,
        productName: productName.trim() || undefined,
        hsCode,
        originCountry,
        claimPreference,
        invoiceValue: Number(invoiceValue),
        invoiceCurrency,
        shipmentMode,
        manualFreightCad: Number(manualFreightCad || 0),
        originPostalCode: originPostalCode.trim() || undefined,
        destinationCountry: destinationCountry.trim() || undefined,
        destinationPostalCode: destinationPostalCode.trim() || undefined,
        parcelWeightKg: Number(parcelWeightKg || 0) || undefined,
        parcelLengthCm: Number(parcelLengthCm || 0) || undefined,
        parcelWidthCm: Number(parcelWidthCm || 0) || undefined,
        parcelHeightCm: Number(parcelHeightCm || 0) || undefined,
      });
      setResult(response);
    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof Error ? error.message : copy.invalidResult,
      });
    } finally {
      setLoading(false);
    }
  }

  function applyCandidate(match: TariffMatchCandidate) {
    resetEstimatedResult();
    setHsCode(match.label);
  }

  const searchHref =
    result?.ok && result.inputs.productName
      ? `${getLocalePath("/search")}?query=${encodeURIComponent(result.inputs.productName)}`
      : getLocalePath("/search");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-maple/10 rounded-2xl shrink-0">
              <Scale className="w-6 h-6 text-maple" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{copy.heading}</h1>
              <p className="text-slate-500 text-base max-w-3xl leading-relaxed">{copy.subheading}</p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">{copy.disclaimer}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-400" />
            {t("tariff.calculate")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.product}</label>
              <input
                type="text"
                value={productName}
                onChange={(event) => {
                  resetEstimatedResult();
                  setProductName(event.target.value);
                }}
                placeholder={copy.productPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.origin}</label>
              <div className="relative">
                <select
                  value={originCountry}
                  onChange={(event) => {
                    resetEstimatedResult();
                    setOriginCountry(event.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all appearance-none cursor-pointer"
                >
                  {ORIGIN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {getOriginOptionLabel(option.value, locale, option.label)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.hsCode}</label>
              <input
                type="text"
                value={hsCode}
                onChange={(event) => {
                  resetEstimatedResult();
                  setHsCode(event.target.value);
                }}
                placeholder={copy.hsPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
              />
              <div className="mt-2 space-y-2">
                {lookupLoading && (
                  <p className="text-xs text-slate-400">{copy.lookupLoading}</p>
                )}

                {lookupResult?.ok && lookupResult.exactMatch && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                    <p className="font-medium text-emerald-900">{copy.lookupExact}</p>
                    <p className="font-mono text-emerald-800 mt-1">{lookupResult.exactMatch.label}</p>
                    <p className="text-emerald-700 mt-1">{lookupResult.exactMatch.description}</p>
                    <p className="text-emerald-700 mt-1">
                      {lookupResult.exactMatch.treatment}: {lookupResult.exactMatch.rate.text}
                    </p>
                  </div>
                )}

                {lookupResult?.ok && lookupResult.matches.length > 1 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      {copy.lookupMatches}
                    </p>
                    <div className="space-y-2">
                      {lookupResult.matches.slice(0, 4).map((match) => (
                        <button
                          key={match.code}
                          type="button"
                          onClick={() => applyCandidate(match)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left hover:border-maple/30 hover:bg-maple/5 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-sm text-slate-900">{match.label}</p>
                              <p className="text-xs text-slate-600 mt-1">{match.description}</p>
                            </div>
                            <span className="text-[11px] text-slate-500 whitespace-nowrap">{match.rateText}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {lookupResult && !lookupResult.ok && !lookupLoading && (
                  <p className="text-xs text-amber-700">{lookupResult.error}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.invoiceValue}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={invoiceValue}
                onChange={(event) => {
                  resetEstimatedResult();
                  setInvoiceValue(event.target.value);
                }}
                placeholder="5000"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.invoiceCurrency}</label>
              <div className="relative">
                <select
                  value={invoiceCurrency}
                  onChange={(event) => {
                    resetEstimatedResult();
                    setInvoiceCurrency(event.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all appearance-none cursor-pointer"
                >
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.shipmentMode}</label>
              <div className="relative">
                <select
                  value={shipmentMode}
                  onChange={(event) => {
                    resetEstimatedResult();
                    setShipmentMode(event.target.value as "manual" | "parcel" | "freight");
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="manual">{copy.shipmentModeManual}</option>
                  <option value="parcel">{copy.shipmentModeParcel}</option>
                  <option value="freight">{copy.shipmentModeFreight}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.freightCad}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={manualFreightCad}
                onChange={(event) => {
                  resetEstimatedResult();
                  setManualFreightCad(event.target.value);
                }}
                placeholder="480"
                disabled={shipmentMode !== "manual"}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">{copy.manualOnly}</p>
            </div>

            {shipmentMode === "parcel" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.originPostalCode}</label>
                  <input
                    type="text"
                    value={originPostalCode}
                    onChange={(event) => {
                      resetEstimatedResult();
                      setOriginPostalCode(event.target.value);
                    }}
                    placeholder={locale === "fr" ? "ex. 10001" : "e.g. 10001"}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.destinationCountry}</label>
                  <input
                    type="text"
                    value={destinationCountry}
                    onChange={(event) => {
                      resetEstimatedResult();
                      setDestinationCountry(event.target.value.toUpperCase());
                    }}
                    placeholder="CA"
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.destinationPostalCode}</label>
                  <input
                    type="text"
                    value={destinationPostalCode}
                    onChange={(event) => {
                      resetEstimatedResult();
                      setDestinationPostalCode(event.target.value);
                    }}
                    placeholder={locale === "fr" ? "ex. V6B1A1" : "e.g. V6B1A1"}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.parcelWeightKg}</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={parcelWeightKg}
                    onChange={(event) => {
                      resetEstimatedResult();
                      setParcelWeightKg(event.target.value);
                    }}
                    placeholder="2.5"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">{copy.parcelDimensions}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={parcelLengthCm}
                      onChange={(event) => {
                        resetEstimatedResult();
                        setParcelLengthCm(event.target.value);
                      }}
                      placeholder={copy.length}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={parcelWidthCm}
                      onChange={(event) => {
                        resetEstimatedResult();
                        setParcelWidthCm(event.target.value);
                      }}
                      placeholder={copy.width}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={parcelHeightCm}
                      onChange={(event) => {
                        resetEstimatedResult();
                        setParcelHeightCm(event.target.value);
                      }}
                      placeholder={copy.height}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{copy.parcelHelp}</p>
                </div>
              </>
            )}
          </div>

          <label className="mt-5 inline-flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={claimPreference}
              onChange={(event) => {
                resetEstimatedResult();
                setClaimPreference(event.target.checked);
              }}
              className="w-4 h-4 rounded border-slate-300 text-maple focus:ring-maple/20"
            />
            {copy.preference}
          </label>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400 max-w-2xl">
{copy.liveInputs}
            </p>
            <button
              onClick={() => {
                void handleCalculate();
              }}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-maple text-white text-sm font-semibold rounded-xl hover:bg-maple-dark active:scale-95 transition-all shadow-sm disabled:opacity-60"
            >
              <DollarSign className="w-4 h-4" />
              {loading ? t("common.loading") : copy.calculate}
            </button>
          </div>
        </section>

        {result && !result.ok && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-start gap-3 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{result.error}</p>
            </div>

            {result.matches && result.matches.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">{copy.ambiguous}</p>
                <div className="grid grid-cols-1 gap-3">
                  {result.matches.map((match) => (
                    <button
                      key={match.code}
                      onClick={() => applyCandidate(match)}
                      className="text-left border border-slate-200 rounded-xl px-4 py-3 hover:border-maple/40 hover:bg-maple/5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-sm text-slate-900">{match.label}</p>
                          <p className="text-sm text-slate-600 mt-1">{match.description}</p>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">{match.rateText}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {result && result.ok && (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <h2 className="font-semibold text-slate-900">{copy.source}</h2>
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400 uppercase tracking-wide text-[11px]">{copy.tariffItem}</dt>
                    <dd className="font-mono text-slate-900 mt-1">{result.tariff.label}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 uppercase tracking-wide text-[11px]">{copy.treatment}</dt>
                    <dd className="text-slate-800 mt-1">{result.tariff.treatment}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 uppercase tracking-wide text-[11px]">{copy.rate}</dt>
                    <dd className="text-slate-800 mt-1">{result.tariff.rate.text}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 uppercase tracking-wide text-[11px]">{copy.fx}</dt>
                    <dd className="text-slate-800 mt-1">
                      {result.fx.series} = {result.fx.rate.toFixed(4)} CAD ({result.fx.asOf})
                    </dd>
                  </div>
                </dl>
                <a
                  href={result.tariff.chapterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-5 text-sm text-maple hover:text-maple-dark font-medium"
                >
                  <Globe className="w-4 h-4" />
                  {copy.chapter}
                </a>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Ship className="w-4 h-4 text-slate-400" />
                  <h2 className="font-semibold text-slate-900">{t("tariff.imported")}</h2>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{copy.invoiceCad}</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(result.costs.invoiceCad, locale, copy.unavailable)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{copy.duty}</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(result.costs.dutyCad, locale, copy.unavailable)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{copy.freight}</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(result.costs.freightCad, locale, copy.unavailable)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{copy.freightSource}</dt>
                    <dd className="font-medium text-slate-900 text-right">{result.freight.source}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{copy.gst}</dt>
                    <dd className="font-medium text-slate-900">{formatCurrency(result.costs.gstCad, locale, copy.unavailable)}</dd>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                    <dt className="font-semibold text-slate-900">{copy.total}</dt>
                    <dd className="font-bold text-lg text-slate-900">{formatCurrency(result.costs.totalImportedCad, locale, copy.unavailable)}</dd>
                  </div>
                </dl>
                {!result.costs.calculable && (
                  <div className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    {copy.calculableFalse}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-4 h-4 text-maple" />
                  <h2 className="font-semibold text-slate-900">{copy.domestic}</h2>
                </div>
                <p className="font-semibold text-slate-900 mb-2">{copy.domesticTitle}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{copy.domesticBody}</p>
                <div className="mt-4 text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{result.domesticComparison.source}</span>
                  </div>
                  {typeof result.domesticComparison.supplierCount === "number" ? (
                    <div className="space-y-2">
                      <p>{result.domesticComparison.supplierCount.toLocaleString(locale === "fr" ? "fr-CA" : "en-CA")} {copy.supplierMatches}</p>
                      <Link href={searchHref} className="text-maple hover:text-maple-dark font-medium">
                        {copy.searchCta}
                      </Link>
                    </div>
                  ) : (
                    <Link href={searchHref} className="text-maple hover:text-maple-dark font-medium">{copy.searchCta}</Link>
                  )}
                </div>
              </div>
            </section>

            {(result.notes.length > 0 || result.warnings.length > 0) && (
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="font-semibold text-slate-900 mb-3">{copy.notes}</h2>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                    {result.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="font-semibold text-slate-900 mb-3">{copy.warnings}</h2>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                    {result.warnings.length > 0 ? result.warnings.map((warning) => <li key={warning}>{warning}</li>) : <li>{copy.noWarnings}</li>}
                  </ul>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function TariffsPageContent() {
  return (
    <Suspense
      fallback={<TariffsPageSkeleton />}
    >
      <TariffsPageInner />
    </Suspense>
  );
}
