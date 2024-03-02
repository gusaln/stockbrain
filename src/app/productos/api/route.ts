import { Producto } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { chunk } from "lodash";
import { NextPageContext } from "next";
import { NextRequest, NextResponse, URLPattern } from "next/server";
import { ServerContext } from "react";

const productos: Producto[] = [
    {   
        "id": 1,
        "categoriaId": 1,
        "marca": "Cisco",
        "modelo": "Catalyst 3750E",
        "descripcion": "Switch Ethernet Gigabit de 48 puertos con PoE+",
        "imagen": null
      },
      {
        "id": 2,
        "categoriaId": 1,
        "marca": "Ubiquiti",
        "modelo": "UniFi Dream Machine Pro",
        "descripcion": "Router Gigabit con firewall y VPN, ideal para r,edes pequeñas y medianas",
        "imagen": null
      },
      {
        "id": 3,
        "categoriaId": 2,
        "marca": "TP-Link",
        "modelo": "Archer AX73",
        "descripcion": "Router Wi-Fi 6 AX5400 de doble banda con Gigabi,t Ethernet",
        "imagen": null
      },
      {
        "id": 4,
        "categoriaId": 2,
        "marca": "Netgear",
        "modelo": "Orbi RBK852",
        "descripcion": "Sistema de malla Wi-Fi 6 AX6000 de tri-banda co,n 2 nodos",
        "imagen": null
      },
      {
        "id": 5,
        "categoriaId": 3,
        "marca": "D-Link",
        "modelo": "GO-SW-5E",
        "descripcion": "Switch Ethernet Gigabit de 5 puertos con PoE+",
        "imagen": null
      },
      {
        "id": 6,
        "categoriaId": 3,
        "marca": "Trendnet",
        "modelo": "TEW-812DRU",
        "descripcion": "Router Gigabit VPN con firewall y QoS",
        "imagen": null
      },
      {
        "id": 7,
        "categoriaId": 4,
        "marca": "TP-Link",
        "modelo": "TL-WN821N",
        "descripcion": "Adaptador USB Wi-Fi N300",
        "imagen": null
      },
      {
        "id": 8,
        "categoriaId": 4,
        "marca": "ASUS",
        "modelo": "PCE-AX3000",
        "descripcion": "Adaptador PCIe Wi-Fi 6 AX3000",
        "imagen": null
      },
      {
        "id": 9,
        "categoriaId": 5,
        "marca": "Ubiquiti",
        "modelo": "UniFi NanoHD",
        "descripcion": "Punto de acceso Wi-Fi 6 AX1800 de doble banda",
        "imagen": null
      },
      {
        "id": 10,
        "categoriaId": 5,
        "marca": "Netgear",
        "modelo": "WAX610",
        "descripcion": "Punto de acceso Wi-Fi 6 AX1800 de doble banda ,con PoE+",
        "imagen": null
      },
      {
        "id": 11,
        "categoriaId": 5,
        "marca": "Netgear",
        "modelo": "WAX610",
        "descripcion": "Punto de acceso Wi-Fi 6 AX1800 de doble banda ,con PoE+",
        "imagen": null
      }
]

export async function GET(request: NextRequest, context = {}) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedRecords = productos.slice(startIndex, endIndex);

    return NextResponse.json(createPaginatedResponse(paginatedRecords, page, limit, productos.length));
}