import { existsProducto, getMovimientosInventarioDelProducto } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { productoId: string } }) {
    const id = parseInt(params.productoId);
    if (Number.isNaN(id) || !(await existsProducto(id))) {
        return NextResponse.json(
            {
                message: "Producto no existe",
            },
            { status: 404 },
        );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const result = await getMovimientosInventarioDelProducto(id, { page, limit });

    return NextResponse.json(createPaginatedResponse(result.data, page, limit, result.total));
}
