import { NextRequest, NextResponse } from "next/server";
import { getSources } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const result = await getSources({
      provider: searchParams.get("provider") || searchParams.get("query") || undefined,
      province: searchParams.get("province") || undefined,
      city: searchParams.get("city") || undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined,
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
