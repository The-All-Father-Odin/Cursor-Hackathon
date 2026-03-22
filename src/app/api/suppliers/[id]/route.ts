import { NextRequest, NextResponse } from "next/server";
import { getSupplierDetail } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fields = request.nextUrl.searchParams.get("fields") || undefined;
    const result = await getSupplierDetail(id, fields);

    if (!result) {
      return NextResponse.json({ ok: false, error: `Supplier not found: ${id}` }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
