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

export const PRODUCTO_ESTADO = {
    BUENO: 1,
    REVISION: 2,
    DEFECTUOSO: 3,
} as const;
type ProductoEstadoEnum = typeof PRODUCTO_ESTADO;
export type ProductoEstado = ProductoEstadoEnum[keyof ProductoEstadoEnum];

export interface ProductoStock {
    id: number;
    productoId: number;
    identificador: string;
    estado: ProductoEstado;
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
            `SELECT productos.id, productos.*, categorias.nombre as categoria_nombre
            FROM productos 
            LEFT JOIN categorias ON productos.categoriaId = categorias.id
            LIMIT ?, ?`,
            [offset, limit]
        );

        console.log(dataRes)

        return [countRes[0].total, dataRes]
    });

    return {
        data: (data as (Producto & {categoria_nombre: string})[]).map((p) => ({
            id: p.id,
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

export async function findProducto(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM productos WHERE id = ?",
            [id]
        );

        return [dataRes[0], dataField]
    });

    return data as Producto | null;
}

export async function updateProducto(id: number, producto: Exclude<Producto, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE productos 
            SET 

                categoriaId = ?, 
                marca = ?, 
                modelo = ?, 
                descripcion = ?, 
                imagen = ?
            WHERE id = ?`,
            [producto.categoriaId, producto.marca, producto.modelo, producto.descripcion, producto.imagen, id]
        );

        return [dataRes[0], dataField]
    });

    return data as Producto | null;
}

export async function getProductoStocks(productoId: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM productoStocks WHERE productoId = ?",
            [productoId]
        );

        return [dataRes as ProductoStock[], dataField]
    }) as [ProductoStock[], unknown];

    return {
        [PRODUCTO_ESTADO.BUENO]: data.find(s => s.estado == PRODUCTO_ESTADO.BUENO)?.cantidad ?? 0,
        [PRODUCTO_ESTADO.REVISION]: data.find(s => s.estado == PRODUCTO_ESTADO.REVISION)?.cantidad ?? 0,
        [PRODUCTO_ESTADO.DEFECTUOSO]: data.find(s => s.estado == PRODUCTO_ESTADO.DEFECTUOSO)?.cantidad ?? 0,
    };
}