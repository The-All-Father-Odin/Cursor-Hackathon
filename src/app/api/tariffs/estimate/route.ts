import { NextRequest, NextResponse } from "next/server";
import { searchSuppliers as searchDomesticSuppliers } from "@/lib/db";
import { calculateImportedCosts } from "@/lib/tariff/calculate";
import { resolveTariff } from "@/lib/tariff/cbsa";
import { getCadFxRate } from "@/lib/tariff/fx";
import { resolveFreightQuote } from "@/lib/tariff/freight";
import {
  getTariffEstimateMessages,
  localizeFreightQuote,
  localizeTariffError,
  normalizeTariffLocale,
} from "@/lib/tariff/messages";
import type { TariffEstimateFailureResponse, TariffEstimateRequest, TariffEstimateSuccessResponse } from "@/types/tariff";

function invalidRequest(error: string): TariffEstimateFailureResponse {
  return { ok: false, error };
}

export async function POST(request: NextRequest) {
  let locale = normalizeTariffLocale();
  try {
    const body = (await request.json()) as Partial<TariffEstimateRequest>;
    locale = normalizeTariffLocale(body.locale);
    const copy = getTariffEstimateMessages(locale);
    const invoiceValue = Number(body.invoiceValue);
    const invoiceCurrency = typeof body.invoiceCurrency === "string" ? body.invoiceCurrency.trim().toUpperCase() : "CAD";
    const shipmentMode = body.shipmentMode ?? "manual";
    const manualFreightCad = Number(body.manualFreightCad ?? 0);

    if (!body.hsCode?.trim()) {
      return NextResponse.json(invalidRequest(copy.invalidRequest.enterHsCode));
    }

    if (!body.originCountry?.trim()) {
      return NextResponse.json(invalidRequest(copy.invalidRequest.selectOriginCountry));
    }

    if (!Number.isFinite(invoiceValue) || invoiceValue <= 0) {
      return NextResponse.json(invalidRequest(copy.invalidRequest.enterValidInvoiceValue));
    }

    const tariffResult = await resolveTariff(body.hsCode, body.originCountry, body.claimPreference, locale);
    if (!tariffResult.ok) {
      return NextResponse.json(tariffResult, { status: 422 });
    }

    const fx = await getCadFxRate(invoiceCurrency);
    const invoiceCad = invoiceValue * fx.rate;
    const notes: string[] = [];
    const freight = await resolveFreightQuote({
      shipmentMode,
      manualFreightCad,
      originCountry: body.originCountry,
      originPostalCode: body.originPostalCode,
      destinationCountry: body.destinationCountry,
      destinationPostalCode: body.destinationPostalCode,
      parcelWeightKg: body.parcelWeightKg,
      parcelLengthCm: body.parcelLengthCm,
      parcelWidthCm: body.parcelWidthCm,
      parcelHeightCm: body.parcelHeightCm,
    });
    const localizedFreight = localizeFreightQuote(freight, locale);
    const warnings = [...localizedFreight.warnings];

    if (tariffResult.tariff.rate.kind === "complex") {
      warnings.push(copy.complexRateWarning(tariffResult.tariff.rate.text));
    }

    const costs = calculateImportedCosts({
      invoiceCad,
      tariffRate: tariffResult.tariff.rate,
      freightCad: localizedFreight.amountCad,
    });

    let supplierCount: number | undefined;
    const productName = body.productName?.trim();
    if (productName) {
      const domesticResults = await searchDomesticSuppliers({
        query: productName,
        limit: 5,
        fields: "supplier_id,business_name",
      });
      supplierCount = domesticResults.count;
      notes.push(copy.matchingSuppliersFound(domesticResults.count));
    } else {
      notes.push(copy.addProductNameNote);
    }

    const response: TariffEstimateSuccessResponse = {
      ok: true,
      inputs: {
        productName: productName || undefined,
        hsCode: body.hsCode,
        originCountry: body.originCountry,
        claimPreference: Boolean(body.claimPreference),
        invoiceValue,
        invoiceCurrency,
        shipmentMode,
        manualFreightCad: shipmentMode === "manual" ? Math.max(manualFreightCad, 0) : undefined,
        originPostalCode: body.originPostalCode?.trim() || undefined,
        destinationCountry: body.destinationCountry?.trim() || undefined,
        destinationPostalCode: body.destinationPostalCode?.trim() || undefined,
        parcelWeightKg: body.parcelWeightKg,
        parcelLengthCm: body.parcelLengthCm,
        parcelWidthCm: body.parcelWidthCm,
        parcelHeightCm: body.parcelHeightCm,
      },
      fx,
      freight: localizedFreight,
      tariff: tariffResult.tariff,
      costs,
      domesticComparison: {
        mode: "rfq",
        source: copy.sourceLocalSupplierDirectory,
        confidence: "low",
        supplierCount,
      },
      notes,
      warnings,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? localizeTariffError(error.message, locale)
        : localizeTariffError("Tariff estimate failed.", locale);
    return NextResponse.json({
      ok: false,
      error: message,
    } satisfies TariffEstimateFailureResponse, { status: 500 });
  }
}
