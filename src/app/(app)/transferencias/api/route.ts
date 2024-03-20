import { getMovimientosInventarioWithRelations } from "@/lib/queries";
import { getTransferenciasWithRelations } from "@/lib/queries/transferencias";
import { createPaginatedResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context = {}) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const result = await getTransferenciasWithRelations(undefined, { page, limit });

    return NextResponse.json(createPaginatedResponse(result.data, page, limit, result.total));
}
