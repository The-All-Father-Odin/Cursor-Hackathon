import { NextRequest, NextResponse } from "next/server";
import { searchSuppliers as searchDomesticSuppliers } from "@/lib/db";
import { calculateImportedCosts } from "@/lib/tariff/calculate";
import { resolveTariff } from "@/lib/tariff/cbsa";
import { getCadFxRate } from "@/lib/tariff/fx";
import { resolveFreightQuote } from "@/lib/tariff/freight";
import type { TariffEstimateFailureResponse, TariffEstimateRequest, TariffEstimateSuccessResponse } from "@/types/tariff";

function invalidRequest(error: string): TariffEstimateFailureResponse {
  return { ok: false, error };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<TariffEstimateRequest>;
    const invoiceValue = Number(body.invoiceValue);
    const invoiceCurrency = typeof body.invoiceCurrency === "string" ? body.invoiceCurrency.trim().toUpperCase() : "CAD";
    const shipmentMode = body.shipmentMode ?? "manual";
    const manualFreightCad = Number(body.manualFreightCad ?? 0);

    if (!body.hsCode?.trim()) {
      return NextResponse.json(invalidRequest("Enter an HS code."));
    }

    if (!body.originCountry?.trim()) {
      return NextResponse.json(invalidRequest("Select an origin country."));
    }

    if (!Number.isFinite(invoiceValue) || invoiceValue <= 0) {
      return NextResponse.json(invalidRequest("Enter a valid invoice value."));
    }

    const tariffResult = await resolveTariff(body.hsCode, body.originCountry, body.claimPreference);
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
    const warnings = [...freight.warnings];

    if (tariffResult.tariff.rate.kind === "complex") {
      warnings.push(`This tariff uses a complex rate formula (${tariffResult.tariff.rate.text}). The calculator cannot derive a precise duty amount yet.`);
    }

    const costs = calculateImportedCosts({
      invoiceCad,
      tariffRate: tariffResult.tariff.rate,
      freightCad: freight.amountCad,
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
      notes.push(`Found ${domesticResults.count.toLocaleString()} matching suppliers in the SourceLocal directory for this product query.`);
    } else {
      notes.push("Add a product name to also estimate how many matching Canadian suppliers exist in the SourceLocal directory.");
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
      freight,
      tariff: tariffResult.tariff,
      costs,
      domesticComparison: {
        mode: "rfq",
        source: "SourceLocal supplier directory",
        confidence: "low",
        supplierCount,
      },
      notes,
      warnings,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Tariff estimate failed.",
    } satisfies TariffEstimateFailureResponse, { status: 500 });
  }
}
