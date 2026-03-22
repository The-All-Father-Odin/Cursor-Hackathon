import { NextResponse } from "next/server";
import { getStats } from "@/lib/db";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({
      ok: true,
      service: "sourcelocal-api",
      supplier_count: stats.stats.supplier_count,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
