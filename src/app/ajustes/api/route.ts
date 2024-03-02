import { AjusteInventario } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const ajustes_inventario: AjusteInventario[] = []

export async function GET(request: NextRequest, context = {}) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    /** Aquí va la consulta a la base de datos */
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedRecords = ajustes_inventario.slice(startIndex, endIndex);
    /** Aquí va la consulta a la base de datos */

    return NextResponse.json(createPaginatedResponse(paginatedRecords, page, limit, ajustes_inventario.length));
}