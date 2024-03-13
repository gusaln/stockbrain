import { AjusteInventario, getAjustesInventarioWithRelations } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context = {}) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    /** Aquí va la consulta a la base de datos */
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedRecords = await getAjustesInventarioWithRelations(undefined, {page, limit});
    /** Aquí va la consulta a la base de datos */

    return NextResponse.json(createPaginatedResponse(paginatedRecords.data, page, limit, paginatedRecords.total));
}