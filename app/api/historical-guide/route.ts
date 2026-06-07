import { NextRequest, NextResponse } from "next/server";
import { getMemoizedMuseumData } from "@/features/encyclopedia/services/museumService";

// ============================================================================
// LEVEL 3: FORCE-DYNAMIC API ROUTE
// Evaluated at request time to ensure no static build failures occur on
// deployment environments when remote APIs or caches are not initialized.
// ============================================================================
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Calling our unified server cache service.
    // Level 1: Request Memoization (React cache) prevents multiple calls within one render tree.
    // Level 2: Data Cache (unstable_cache + fetch options) preserves server fetch content safely.
    const data = await getMemoizedMuseumData();

    return NextResponse.json({
      success: true,
      source: "deep-cached-museum-archive",
      revalidatedAt: new Date().toISOString(),
      cacheLevels: {
        level1: "Request Memoization (React cache Context)",
        level2: "Data Cache (Next.js server-cached entries)",
        level3: "Full Route Cache (ISR - Static Route compile)"
      },
      data
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
