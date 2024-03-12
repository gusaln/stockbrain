import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";

export const AJUSTE_INVENTARIO_TIPO = {
    ENTRADA: 1,
    SALIDA: 2,
} as const;
type AjusteInventarioTipoEnum = typeof AJUSTE_INVENTARIO_TIPO;
type AjusteInventarioTipo = AjusteInventarioTipoEnum[keyof AjusteInventarioTipoEnum];
const ReverseMap = new Map(Object.entries(AJUSTE_INVENTARIO_TIPO).map(([k, v]) => [v, k as keyof AjusteInventarioTipoEnum]))

export interface AjusteInventario {
    id: number;
    operadorId: number;
    fecha: string;
    // almacenId: number;
    productoId: number;
    tipo: AjusteInventarioTipo;
    cantidad: number;
    motivo: string;
}

export async function createAjusteInventario(
    operadorId: number,
    fecha: string,
    productoId: number,
    tipo: AjusteInventarioTipo,
    cantidad: number,
    motivo: string,
) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "INSERT INTO ajustesInventario (operadorId, fecha, productoId, tipo, cantidad, motivo) VALUES (?, ?, ?, ?, ?, ?)",
            [operadorId, fecha, productoId, tipo, cantidad, motivo]
        );
    })

    return (result as ResultSetHeader).insertId;
}

export async function getAjustesInventario(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ajustesInventario");

        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM ajustesInventario LIMIT ?, ?",
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: data as AjusteInventario[],
        total: total as number
    }
}

export async function getAjustesInventarioWithRelations(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ajustesInventario");

        const [dataRes, dataField] = await connection.query(
            `SELECT 
                ajustesInventario.*,
                usuarios.nombre as operador_nombre,
                productos.marca as producto_marca,
                productos.modelo as producto_modelo
            FROM ajustesInventario 
            LEFT JOIN usuarios ON ajustesInventario.operadorId = usuarios.id
            LEFT JOIN productos ON ajustesInventario.productoId = productos.id
            LIMIT ?, ?`,
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: (data as Record<string, any>[]).map((ajuste) => ({
            id: ajuste.id,
            operadorId: ajuste.operadorId,
            operador: {
                id: ajuste.operadorId,
                nombre: ajuste.operador_nombre
            },
            // almacen: {
            //     id: ajuste.almacenId,
            //     nombre: ajuste.almacen_nombre
            // },
            producto: {
                id: ajuste.productoId,
                marca: ajuste.producto_marca,
                modelo: ajuste.producto_modelo,
            },
            fecha: ajuste.fecha,
            almacenId: ajuste.almacenId,
            productoId: ajuste.productoId,
            tipo: ajuste.tipo,
            tipoNombre: ReverseMap.get(ajuste.tipo),
            cantidad: ajuste.cantidad,
            motivo: ajuste.motivo,
        })),
        total: total as number
    }
}

export type AjusteInventarioWithRelations = AjusteInventario & {
    operador: {
        id: number,
        nombre: string
    },
    // almacen: {
    //     id: number,
    //     nombre: string
    // },
    producto: {
        id: number,
        marca: string,
        modelo: string
    },
}

export async function findAjusteInventario(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM ajustesInventario WHERE id = ?",
            [id]
        );

        return [dataRes[0], dataField]
    });

    return data as AjusteInventario | null;
}

export async function updateAjusteInventario(id: number, ajusteInventario: Exclude<AjusteInventario, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE ajustesInventario 
            SET 
                operadorId = ?, 
                fecha = ?, 
                productoId = ?, 
                tipo = ?, 
                cantidad = ?,
                motivo = ?
            WHERE id = ?`,
            [ajusteInventario.operadorId, ajusteInventario.fecha, ajusteInventario.productoId, ajusteInventario.tipo, ajusteInventario.cantidad, ajusteInventario.motivo, id]
        );

        return [dataRes[0], dataField]
    });

    return data as AjusteInventario | null;
}

