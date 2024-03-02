import { OrdenCompra } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { chunk } from "lodash";
import { NextPageContext } from "next";
import { NextRequest, NextResponse, URLPattern } from "next/server";
import { ServerContext } from "react";

const OrdenesCompra: OrdenCompra[] = [
    {
        "id": 1,
        "proveedorId": 1 ,
        "fecha": "12/09/2023" ,
        "operadorId": 1,
    },
    {
        "id": 2,
        "proveedorId": 2 ,
        "fecha": "09/02/2024" ,
        "operadorId": 2,
    },
    {
        "id": 3,
        "proveedorId": 3 ,
        "fecha": "12/01/2024" ,
        "operadorId": 3,
    },
    {
        "id": 4,
        "proveedorId": 4 ,
        "fecha": "02/02/2024" ,
        "operadorId": 4,
    },
    {
        "id": 5,
        "proveedorId": 5 ,
        "fecha": "08/01/2024" ,
        "operadorId": 5,
    },]

    export async function GET(request: NextRequest, context = {}) {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    
        /** Aquí va la consulta a la base de datos */
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const paginatedRecords = OrdenesCompra.slice(startIndex, endIndex);
        /** Aquí va la consulta a la base de datos */
    
        return NextResponse.json(createPaginatedResponse(paginatedRecords, page, limit, OrdenesCompra.length));}