import { NextRequest, NextResponse } from "next/server";
import { getFedExConfigStatus, probeFedExAuth } from "@/lib/tariff/fedex";

export async function GET(request: NextRequest) {
  const probe = request.nextUrl.searchParams.get("probe");
  const config = getFedExConfigStatus();

  if (!config.configured) {
    return NextResponse.json({
      ok: false,
      provider: "fedex",
      configured: false,
      missing: config.missing,
      authUrl: config.authUrl,
      rateUrl: config.rateUrl,
      message: "FedEx parcel quoting is not configured yet.",
    });
  }

  if (probe !== "auth") {
    return NextResponse.json({
      ok: true,
      provider: "fedex",
      configured: true,
      authChecked: false,
      authUrl: config.authUrl,
      rateUrl: config.rateUrl,
      message: "FedEx parcel quoting is configured. Append ?probe=auth to test OAuth only.",
    });
  }

  try {
    const auth = await probeFedExAuth();
    return NextResponse.json({
      ok: auth.ok,
      provider: "fedex",
      configured: true,
      authChecked: true,
      tokenReceived: auth.tokenReceived,
      authUrl: config.authUrl,
      rateUrl: config.rateUrl,
      message: "FedEx OAuth probe succeeded.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        provider: "fedex",
        configured: true,
        authChecked: true,
        authUrl: config.authUrl,
        rateUrl: config.rateUrl,
        error: error instanceof Error ? error.message : "FedEx auth probe failed.",
      },
      { status: 502 }
    );
  }
}
