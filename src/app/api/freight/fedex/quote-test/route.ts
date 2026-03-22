import { NextRequest, NextResponse } from "next/server";
import { canQuoteFedExParcel, getFedExConfigStatus, isFedExQuoteTestEnabled, quoteFedExParcel } from "@/lib/tariff/fedex";

interface QuoteTestBody {
  originCountry?: string;
  originPostalCode?: string;
  destinationCountry?: string;
  destinationPostalCode?: string;
  parcelWeightKg?: number;
  parcelLengthCm?: number;
  parcelWidthCm?: number;
  parcelHeightCm?: number;
}

function invalid(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  if (!isFedExQuoteTestEnabled()) {
    return invalid("FedEx quote-test is disabled in production.", 403);
  }

  const config = getFedExConfigStatus();
  if (!canQuoteFedExParcel()) {
    return NextResponse.json(
      {
        ok: false,
        error: "FedEx parcel quoting is not configured yet.",
        missing: config.missing,
      },
      { status: 503 }
    );
  }

  let body: QuoteTestBody;
  try {
    body = (await request.json()) as QuoteTestBody;
  } catch {
    return invalid("Send a JSON request body.");
  }

  const originCountry = body.originCountry?.trim().toUpperCase();
  const originPostalCode = body.originPostalCode?.trim();
  const destinationCountry = body.destinationCountry?.trim().toUpperCase();
  const destinationPostalCode = body.destinationPostalCode?.trim();
  const parcelWeightKg = Number(body.parcelWeightKg);

  if (!originCountry || !originPostalCode || !destinationCountry || !destinationPostalCode) {
    return invalid("originCountry, originPostalCode, destinationCountry, and destinationPostalCode are required.");
  }

  if (!Number.isFinite(parcelWeightKg) || parcelWeightKg <= 0) {
    return invalid("parcelWeightKg must be a positive number.");
  }

  try {
    const quote = await quoteFedExParcel({
      originCountry,
      originPostalCode,
      destinationCountry,
      destinationPostalCode,
      parcelWeightKg,
      parcelLengthCm: body.parcelLengthCm,
      parcelWidthCm: body.parcelWidthCm,
      parcelHeightCm: body.parcelHeightCm,
    });

    return NextResponse.json({
      ok: true,
      provider: "fedex",
      quote: {
        amountCad: quote.amountCad,
        serviceName: quote.serviceName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        provider: "fedex",
        error: error instanceof Error ? error.message : "FedEx quote test failed.",
      },
      { status: 502 }
    );
  }
}
