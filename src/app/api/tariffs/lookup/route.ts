import { NextRequest, NextResponse } from "next/server";
import { localizeTariffError, normalizeTariffLocale } from "@/lib/tariff/messages";
import { lookupTariffResponse } from "@/lib/tariff/cbsa";

export async function GET(request: NextRequest) {
  const locale = normalizeTariffLocale(request.nextUrl.searchParams.get("locale"));
  try {
    const { searchParams } = request.nextUrl;
    const hs = searchParams.get("hs") || searchParams.get("q") || "";
    const originCountry = searchParams.get("originCountry") || searchParams.get("origin") || "OTHER";
    const claimPreference = searchParams.get("claimPreference") === "true";

    const result = await lookupTariffResponse(hs, originCountry, claimPreference, locale);
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error
          ? localizeTariffError(error.message, locale)
          : localizeTariffError("Tariff lookup failed.", locale),
      },
      { status: 500 }
    );
  }
}
