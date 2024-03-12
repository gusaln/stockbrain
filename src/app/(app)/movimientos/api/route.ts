import { MovimientoInventario } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const movimiento_inventario: MovimientoInventario[] = [
    {
        "id": 1,
        "fecha": "2022-01-01",
        "operadorId": 1,
        "productoId": 1,
        "estadoOrigen": 1,
        "estadoDestino": 2,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 10
    },
    {
        "id": 2,
        "fecha": "2022-01-15",
        "operadorId": 2,
        "productoId": 2,
        "estadoOrigen": 2,
        "estadoDestino": 1,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 5
    },
    {
        "id": 3,
        "fecha": "2022-01-20",
        "operadorId": 3,
        "productoId": 3,
        "estadoOrigen": 1,
        "estadoDestino": 3,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 3
    },
    {
        "id": 4,
        "fecha": "2022-01-25",
        "operadorId": 4,
        "productoId": 4,
        "estadoOrigen": 3,
        "estadoDestino": 2,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 7
    },
    {
        "id": 5,
        "fecha": "2022-02-01",
        "operadorId": 5,
        "productoId": 5,
        "estadoOrigen": 2,
        "estadoDestino": 1,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 2
    },
    {
        "id": 6,
        "fecha": "2022-02-05",
        "operadorId": 6,
        "productoId": 6,
        "estadoOrigen": 1,
        "estadoDestino": 3,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 10
    },
    {
        "id": 7,
        "fecha": "2022-02-10",
        "operadorId": 7,
        "productoId": 7,
        "estadoOrigen": 3,
        "estadoDestino": 2,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 5
    },
    {
        "id": 8,
        "fecha": "2022-02-15",
        "operadorId": 8,
        "productoId": 8,
        "estadoOrigen": 2,
        "estadoDestino": 1,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 5
    },
    {
        "id": 9,
        "fecha": "2022-02-20",
        "operadorId": 9,
        "productoId": 9,
        "estadoOrigen": 1,
        "estadoDestino": 3,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 3
    },
    {
        "id": 10,
        "fecha": "2022-02-25",
        "operadorId": 10,
        "productoId": 10,
        "estadoOrigen": 3,
        "estadoDestino": 2,
        "tipo": 3,
        "relacionId": null,
        "cantidad": 7
    }
]

export async function GET(request: NextRequest, context = {}) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    /** Aquí va la consulta a la base de datos */
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedRecords = movimiento_inventario.slice(startIndex, endIndex);
    /** Aquí va la consulta a la base de datos */

    return NextResponse.json(createPaginatedResponse(paginatedRecords, page, limit, movimiento_inventario.length));
}