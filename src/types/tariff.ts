export type ShipmentMode = "manual" | "parcel" | "freight";
export type DomesticComparisonMode = "benchmark" | "rfq" | "catalog" | "quote";
export type TariffRateKind = "free" | "ad_valorem" | "complex";
export type TariffTreatmentCode =
  | "MFN"
  | "AUT"
  | "CCCT"
  | "CEUT"
  | "COLT"
  | "CRT"
  | "CT"
  | "CPTPT"
  | "GPT"
  | "HNT"
  | "IT"
  | "JT"
  | "KRT"
  | "MXT"
  | "NZT"
  | "PAT"
  | "UAT"
  | "UKT"
  | "UST";

export interface TariffEstimateRequest {
  productName?: string;
  hsCode: string;
  originCountry: string;
  claimPreference?: boolean;
  invoiceValue: number;
  invoiceCurrency: string;
  shipmentMode: ShipmentMode;
  manualFreightCad?: number;
  originPostalCode?: string;
  destinationCountry?: string;
  destinationPostalCode?: string;
  parcelWeightKg?: number;
  parcelLengthCm?: number;
  parcelWidthCm?: number;
  parcelHeightCm?: number;
}

export interface TariffRate {
  kind: TariffRateKind;
  text: string;
  percent: number | null;
}

export interface FxQuote {
  source: "Bank of Canada";
  series: string;
  rate: number;
  asOf: string;
}

export interface FreightQuote {
  mode: ShipmentMode;
  source: string;
  amountCad: number;
  live: boolean;
  warnings: string[];
}

export interface TariffMatchCandidate {
  code: string;
  label: string;
  description: string;
  treatment: TariffTreatmentCode;
  rateText: string;
}

export interface TariffResolution {
  code: string;
  label: string;
  description: string;
  treatment: TariffTreatmentCode;
  rate: TariffRate;
  source: "CBSA";
  chapterUrl: string;
}

export interface CostBreakdown {
  invoiceCad: number;
  valueForDutyCad: number;
  dutyCad: number | null;
  freightCad: number;
  surtaxCad: number;
  gstCad: number | null;
  totalImportedCad: number | null;
  calculable: boolean;
}

export interface DomesticComparison {
  mode: DomesticComparisonMode;
  source: string;
  confidence: "low" | "medium" | "high";
  supplierCount?: number;
  benchmarkCad?: number | null;
}

export interface TariffEstimateSuccessResponse {
  ok: true;
  inputs: TariffEstimateRequest;
  fx: FxQuote;
  freight: FreightQuote;
  tariff: TariffResolution;
  costs: CostBreakdown;
  domesticComparison: DomesticComparison;
  notes: string[];
  warnings: string[];
}

export interface TariffEstimateFailureResponse {
  ok: false;
  error: string;
  matches?: TariffMatchCandidate[];
}

export interface TariffLookupSuccessResponse {
  ok: true;
  query: string;
  treatment: TariffTreatmentCode;
  chapterUrl: string;
  matches: TariffMatchCandidate[];
  exactMatch?: TariffResolution | null;
}

export type TariffEstimateResponse = TariffEstimateSuccessResponse | TariffEstimateFailureResponse;
export type TariffLookupResponse = TariffLookupSuccessResponse | TariffEstimateFailureResponse;
