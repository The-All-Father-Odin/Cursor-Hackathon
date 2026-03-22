import { NextRequest, NextResponse } from "next/server";
import { lookupTariffResponse } from "@/lib/tariff/cbsa";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const hs = searchParams.get("hs") || searchParams.get("q") || "";
    const originCountry = searchParams.get("originCountry") || searchParams.get("origin") || "OTHER";
    const claimPreference = searchParams.get("claimPreference") === "true";

    const result = await lookupTariffResponse(hs, originCountry, claimPreference);
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Tariff lookup failed." },
      { status: 500 }
    );
  }
}
