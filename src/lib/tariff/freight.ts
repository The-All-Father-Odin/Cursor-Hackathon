import type { FreightQuote, ShipmentMode } from "@/types/tariff";
import { canQuoteFedExParcel, quoteFedExParcel } from "@/lib/tariff/fedex";

interface ResolveFreightInput {
  shipmentMode: ShipmentMode;
  manualFreightCad?: number;
  originCountry?: string;
  originPostalCode?: string;
  destinationCountry?: string;
  destinationPostalCode?: string;
  parcelWeightKg?: number;
  parcelLengthCm?: number;
  parcelWidthCm?: number;
  parcelHeightCm?: number;
}

export async function resolveFreightQuote({
  shipmentMode,
  manualFreightCad,
  originCountry,
  originPostalCode,
  destinationCountry,
  destinationPostalCode,
  parcelWeightKg,
  parcelLengthCm,
  parcelWidthCm,
  parcelHeightCm,
}: ResolveFreightInput): Promise<FreightQuote> {
  if (shipmentMode === "manual") {
    return {
      mode: shipmentMode,
      source: "manual input",
      amountCad: Math.max(Number(manualFreightCad ?? 0), 0),
      live: false,
      warnings: [],
    };
  }

  if (shipmentMode === "parcel") {
    const normalizedOriginCountry = originCountry?.trim().toUpperCase();
    const normalizedDestinationCountry = destinationCountry?.trim().toUpperCase() || "CA";

    if (!normalizedOriginCountry || !originPostalCode || !destinationPostalCode || !Number.isFinite(parcelWeightKg) || Number(parcelWeightKg) <= 0) {
      return {
        mode: shipmentMode,
        source: "FedEx parcel quote (missing shipment fields)",
        amountCad: 0,
        live: false,
        warnings: [
          "Parcel quote mode needs origin postal code, destination postal code, origin country, and parcel weight before a carrier quote can run.",
        ],
      };
    }

    if (!canQuoteFedExParcel()) {
      return {
        mode: shipmentMode,
        source: "FedEx parcel quote adapter not configured",
        amountCad: 0,
        live: false,
        warnings: [
          "FedEx parcel quote mode is ready, but FEDEX_CLIENT_ID, FEDEX_CLIENT_SECRET, and FEDEX_ACCOUNT_NUMBER are not configured yet. Freight was set to 0 CAD.",
        ],
      };
    }

    try {
      const quote = await quoteFedExParcel({
        originCountry: normalizedOriginCountry,
        originPostalCode,
        destinationCountry: normalizedDestinationCountry,
        destinationPostalCode,
        parcelWeightKg: Number(parcelWeightKg),
        parcelLengthCm,
        parcelWidthCm,
        parcelHeightCm,
      });

      return {
        mode: shipmentMode,
        source: `FedEx parcel quote (${quote.serviceName})`,
        amountCad: quote.amountCad,
        live: true,
        warnings: [],
      };
    } catch (error) {
      return {
        mode: shipmentMode,
        source: "FedEx parcel quote failed",
        amountCad: 0,
        live: false,
        warnings: [
          error instanceof Error
            ? error.message
            : "FedEx parcel quote failed, so freight was set to 0 CAD.",
        ],
      };
    }
  }

  if (shipmentMode === "freight") {
    return {
      mode: shipmentMode,
      source: "freight quote adapter not configured",
      amountCad: 0,
      live: false,
      warnings: [
        "Freight quote mode is scaffolded but no external freight provider is configured yet. Freight was set to 0 CAD.",
      ],
    };
  }

  return {
    mode: shipmentMode,
    source: "unknown shipment mode",
    amountCad: 0,
    live: false,
    warnings: ["Unknown shipment mode. Freight was set to 0 CAD."],
  };
}
