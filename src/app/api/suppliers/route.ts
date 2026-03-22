import { NextRequest, NextResponse } from "next/server";
import { searchSuppliers } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const result = await searchSuppliers({
      supplier_id: searchParams.get("supplier_id") || undefined,
      query: searchParams.get("query") || undefined,
      naics: searchParams.get("naics") || searchParams.get("category") || undefined,
      province: searchParams.get("province") || undefined,
      city: searchParams.get("city") || undefined,
      capacity: searchParams.get("capacity") || undefined,
      provider: searchParams.get("provider") || undefined,
      status: searchParams.get("status") || undefined,
      has_geocode: searchParams.get("has_geocode") === "true",
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined,
      fields: searchParams.get("fields") || undefined,
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
