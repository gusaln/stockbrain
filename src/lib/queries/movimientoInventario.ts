import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { ProductoEstado } from ".";

const MOVIMIENTO_INVENTARIO_TIPO = {
    ENTRADA: 1,
    SALIDA: 2,
    TRANSFERENCIA: 3,
    AJUSTE: 4,
} as const;
type MovimientoInventarioTipoEnum = typeof MOVIMIENTO_INVENTARIO_TIPO;
type MovimientoInventarioTipo = MovimientoInventarioTipoEnum[keyof MovimientoInventarioTipoEnum];

export interface MovimientoInventario {
    id: number;
    fecha: string;
    operadorId: number;
    productoId: number;
    estadoOrigen: ProductoEstado | null;
    estadoDestino: ProductoEstado;
    tipo: MovimientoInventarioTipo;
    relacionId: number | null;
    cantidad: number;
}

export async function createMovimientoInventario(
    fecha: string,
    operadorId: number,
    productoId: number,
    estadoOrigen: ProductoEstado | null,
    estadoDestino: ProductoEstado,
    tipo: MovimientoInventarioTipo,
    relacionId: number | null,
    cantidad: number,
    motivo: string,
) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            `INSERT INTO movimientosInventario (
                fecha, operadorId, productoId, estadoOrigen, estadoDestino, tipo, relacionId, cantidad
            ) VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?)`,
            [fecha, operadorId, productoId, estadoOrigen, estadoDestino, tipo, relacionId, cantidad]
        );
    })

    return (result as ResultSetHeader).insertId;
}

export async function getMovimientosInventario(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM movimientosInventario");

        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM movimientosInventario LIMIT ?, ?",
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: data as MovimientoInventario[],
        total: total as number
    }
}

export async function findMovimientoInventario(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM movimientosInventario WHERE id = ?",
            [id]
        );

        return [dataRes[0], dataField]
    });

    return data as MovimientoInventario | null;
}

export async function updateMovimientoInventario(id: number, movimientoInventario: Exclude<MovimientoInventario, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE movimientosInventario 
            SET 
                fecha = ?,
                operadorId = ?,
                productoId = ?,
                estadoOrigen = ?,
                estadoDestino = ?,
                tipo = ?,
                relacionId = ?,
                cantidad = ?
            WHERE id = ?`,
            [
                movimientoInventario.fecha,
                movimientoInventario.operadorId,
                movimientoInventario.productoId,
                movimientoInventario.estadoOrigen,
                movimientoInventario.estadoDestino,
                movimientoInventario.tipo,
                movimientoInventario.relacionId,
                movimientoInventario.cantidad,
                id
            ]
        );

        return [dataRes[0], dataField]
    });

    return data as MovimientoInventario | null;
}

