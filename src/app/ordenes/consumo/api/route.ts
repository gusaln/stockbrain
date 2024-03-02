import { OrdenConsumo } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { chunk } from "lodash";
import { NextPageContext } from "next";
import { NextRequest, NextResponse, URLPattern } from "next/server";
import { ServerContext } from "react";

const OrdenesConsumo: OrdenConsumo[] = [
    {
        "id": 1,
        "descripcion": "Compra de 10 switches Gigabit Ethernet" ,
        "fecha": "12/09/2023" ,
        "operadorId": 1,
    },
    {
        "id": 2,
        "descripcion": "Contratación de servicio de internet dedicado de 100 Mbps" ,
        "fecha": "09/02/2024" ,
        "operadorId": 2,
    },
    {
        "id": 3,
        "descripcion": "Mantenimiento preventivo de 5 routers" ,
        "fecha": "12/01/2024" ,
        "operadorId": 3,
    },
    {
        "id": 4,
        "descripcion": "Pedido de ancho de banda para sucursal" ,
        "fecha": "02/02/2024" ,
        "operadorId": 4,
    },
    {
        "id": 5,
        "descripcion": "Implementación de nuevo protocolo de seguridad" ,
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
    
        const paginatedRecords = OrdenesConsumo.slice(startIndex, endIndex);
        /** Aquí va la consulta a la base de datos */
    
        return NextResponse.json(createPaginatedResponse(paginatedRecords, page, limit, OrdenesConsumo.length));}