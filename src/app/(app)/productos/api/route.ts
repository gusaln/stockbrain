import { getProductosWithCategorias } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context = {}) {
    const url = new URL(request.url);
    const busqueda = url.searchParams.get('busqueda') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const result = await getProductosWithCategorias(busqueda, {page, limit})

    return NextResponse.json(createPaginatedResponse(result.data, page, limit, result.total));
}