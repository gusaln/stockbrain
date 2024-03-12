import { Usuario } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { chunk } from "lodash";
import { NextPageContext } from "next";
import { NextRequest, NextResponse, URLPattern } from "next/server";
import { ServerContext } from "react";

const usuarios: Usuario[] = [
    { id: 1, nombre: "Osbert Juschke", email: "ojuschke0@about.com", rol: 1 },
    { id: 2, nombre: "Alejandrina Custard", email: "acustard1@histats.com", rol: 1 },
    { id: 3, nombre: "Kerstin Tench", email: "ktench2@upenn.edu", rol: 1 },
    { id: 4, nombre: "Winona Hollyard", email: "whollyard3@php.net", rol: 1 },
    { id: 5, nombre: "Kenon Shegog", email: "kshegog4@unc.edu", rol: 1 },
    { id: 6, nombre: "Wright Champley", email: "wchampley5@dedecms.com", rol: 1 },
    { id: 7, nombre: "Orland Stanlike", email: "ostanlike6@sciencedirect.com", rol: 1 },
    { id: 8, nombre: "Bernelle McLagan", email: "bmclagan7@deviantart.com", rol: 1 },
    { id: 9, nombre: "Joyous Balma", email: "jbalma8@chicagotribune.com", rol: 1 },
    { id: 10, nombre: "Connie Yashin", email: "cyashin9@php.net", rol: 1 },
    { id: 11, nombre: "Sophi Varvell", email: "svarvella@chronoengine.com", rol: 1 },
    { id: 12, nombre: "Merrilee Lightbowne", email: "mlightbowneb@tinyurl.com", rol: 1 },
    { id: 13, nombre: "Brandie O'Quin", email: "boquinc@indiatimes.com", rol: 1 },
    { id: 14, nombre: "Tilly Percival", email: "tpercivald@answers.com", rol: 1 },
    { id: 15, nombre: "Marrilee Derwin", email: "mderwine@cdbaby.com", rol: 1 },
    { id: 16, nombre: "Catina McDermot", email: "cmcdermotf@unesco.org", rol: 1 },
    { id: 17, nombre: "Reynold Faltin", email: "rfalting@angelfire.com", rol: 1 },
    { id: 18, nombre: "Sibylla Dorkins", email: "sdorkinsh@bigcartel.com", rol: 1 },
    { id: 19, nombre: "Kelcy Wadmore", email: "kwadmorei@bandcamp.com", rol: 1 },
    { id: 20, nombre: "Dagmar Coughtrey", email: "dcoughtreyj@who.int", rol: 1 },
];

export async function GET(request: NextRequest, context = {}){
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedRecords = usuarios.slice(startIndex, endIndex);

    return NextResponse.json(createPaginatedResponse(paginatedRecords, page, limit, usuarios.length));
}