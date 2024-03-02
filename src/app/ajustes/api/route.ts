import { AjusteInventario } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const ajustes_inventario: AjusteInventario[] = [
    {
        "id": 1,
        "operadorId": 2,
        "fecha": "2022-01-01",
        "almacenId": 1,
        "productoId": 1,
        "tipo": 1,
        "cantidad": 10,
        "motivo": "Initial stock"
    },
    {
        "id": 2,
        "operadorId": 1,
        "fecha": "2022-01-15",
        "almacenId": 1,
        "productoId": 2,
        "tipo": 1,
        "cantidad": 5,
        "motivo": "Restock"
    },
    {
        "id": 3,
        "operadorId": 2,
        "fecha": "2022-01-20",
        "almacenId": 1,
        "productoId": 1,
        "tipo": 2,
        "cantidad": 3,
        "motivo": "Actualización de laboratorio"
    },
    {
        "id": 4,
        "operadorId": 2,
        "fecha": "2022-01-25",
        "almacenId": 2,
        "productoId": 3,
        "tipo": 1,
        "cantidad": 7,
        "motivo": "Initial stock"
    },
    {
        "id": 5,
        "operadorId": 1,
        "fecha": "2022-02-01",
        "almacenId": 2,
        "productoId": 3,
        "tipo": 2,
        "cantidad": 2,
        "motivo": "Actualización de laboratorio"
    },
    {
        "id": 6,
        "operadorId": 1,
        "fecha": "2022-02-05",
        "almacenId": 1,
        "productoId": 2,
        "tipo": 1,
        "cantidad": 10,
        "motivo": "Restock"
    },
    {
        "id": 7,
        "operadorId": 1,
        "fecha": "2022-02-10",
        "almacenId": 1,
        "productoId": 1,
        "tipo": 2,
        "cantidad": 5,
        "motivo": "Actualización de laboratorio"
    },
    {
        "id": 8,
        "operadorId": 2,
        "fecha": "2022-02-15",
        "almacenId": 2,
        "productoId": 3,
        "tipo": 1,
        "cantidad": 5,
        "motivo": "Restock"
    },
    {
        "id": 9,
        "operadorId": 2,
        "fecha": "2022-02-20",
        "almacenId": 1,
        "productoId": 2,
        "tipo": 2,
        "cantidad": 3,
        "motivo": "Actualización de laboratorio"
    },
    {
        "id": 10,
        "operadorId": 2,
        "fecha": "2022-02-25",
        "almacenId": 2,
        "productoId": 3,
        "tipo": 1,
        "cantidad": 7,
        "motivo": "Restock"
    }
]

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