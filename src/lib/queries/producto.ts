import { ResultSetHeader } from "mysql2/promise";
import { runQuery } from "../db";
import { Pagination } from "./pagination";

export interface Producto {
    id: number;
    categoriaId: number;
    // proveedorId: number;
    // nombre: string;
    marca: string;
    modelo: string;
    descripcion: string;
    // precio: string; // qué pasa si se compraron cosas a distintos precios?
    imagen: string | null;
}

const ESTADO = {
    bueno: 1,
    revision: 2,
    defectuoso: 3,
} as const;
type EstadoEnum = typeof ESTADO;
type Estado = EstadoEnum[keyof EstadoEnum];

export interface ProductoStock {
    id: number;
    productoId: number;
    identificador: string;
    estado: Estado;
    cantidad: number;
}

export async function createProducto(
    categoriaId: number,
    marca: string,
    modelo: string,
    descripcion: string,
    imagen: string | null,
) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "INSERT INTO productos (categoriaId, marca, modelo, descripcion, imagen) VALUES (?, ?, ?, ?, ?)",
            [
                categoriaId,
                marca,
                modelo,
                descripcion,
                imagen,
            ]
        );
    })

    return (result as ResultSetHeader).insertId;
}

export async function getProductosWithCategorias(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM productos");

        const [dataRes, dataField] = await connection.query(
            `SELECT productos.*, categorias.nombre as categoria_nombre
            FROM productos 
            LEFT JOIN categorias ON productos.categoriaId = categorias.id
            LIMIT ?, ?`,
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: (data as (Producto & {categoria_nombre: string})[]).map((p) => ({
            categoriaId: p.categoriaId,
            categoria: {
                id: p.categoriaId,
                nombre: p.categoria_nombre
            },
            marca: p.marca,
            modelo: p.modelo,
            descripcion: p.descripcion,
            imagen: p.imagen,
        })),
        total: total as number
    }
}
