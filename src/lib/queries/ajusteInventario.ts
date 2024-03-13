import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import {
    AJUSTE_INVENTARIO_TIPO,
    AjusteInventario,
    AjusteInventarioTipo,
    AjusteInventarioTipoMap,
    MOVIMIENTO_INVENTARIO_TIPO,
    PRODUCTO_ESTADO,
} from "./shared";
import { formatForSql } from "./utils";

export async function createAjusteInventario(
    operadorId: number,
    fecha: Date,
    productoId: number,
    tipo: AjusteInventarioTipo,
    cantidad: number,
    motivo: string,
) {
    const fechaSql = formatForSql(fecha);

    const ajusteId = await runQuery(async function (connection) {
        const [result] = await connection.query(
            "INSERT INTO ajustesInventario (operadorId, fecha, productoId, tipo, cantidad, motivo) VALUES (?, ?, ?, ?, ?, ?)",
            [operadorId, fechaSql, productoId, tipo, cantidad, motivo],
        );

        const ajusteId = (result as ResultSetHeader).insertId;

        await connection.query(
            `INSERT INTO movimientosInventario 
                (   
                    fecha,
                    operadorId,
                    productoId,
                    estadoDestino,
                    tipo,
                    ajusteId,
                    cantidad
                ) 
            VALUES 
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`,
            [
                fechaSql,
                operadorId,
                productoId,
                PRODUCTO_ESTADO.BUENO,
                MOVIMIENTO_INVENTARIO_TIPO.AJUSTE,
                ajusteId,
                tipo == AJUSTE_INVENTARIO_TIPO.ENTRADA ? cantidad : -cantidad,
            ],
        );

        return ajusteId;
    });

    return ajusteId;
}

export async function getAjustesInventario(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ajustesInventario");

        const [dataRes, dataField] = await connection.query("SELECT * FROM ajustesInventario LIMIT ?, ?", [
            offset,
            limit,
        ]);

        return [countRes[0].total, dataRes];
    });

    return {
        data: data as AjusteInventario[],
        total: total as number,
    };
}

export async function getAjustesInventarioWithRelations(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
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
            ORDER BY fecha DESC
            LIMIT ?, ?`,
            [offset, limit],
        );

        return [countRes[0].total, dataRes];
    });

    return {
        data: (data as Record<string, any>[]).map((ajuste) => ({
            id: ajuste.id,
            operadorId: ajuste.operadorId,
            operador: {
                id: ajuste.operadorId,
                nombre: ajuste.operador_nombre,
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
            tipoNombre: AjusteInventarioTipoMap.get(ajuste.tipo),
            cantidad: ajuste.cantidad,
            motivo: ajuste.motivo,
        })),
        total: total as number,
    };
}

export type AjusteInventarioWithRelations = AjusteInventario & {
    operador: {
        id: number;
        nombre: string;
    };
    // almacen: {
    //     id: number,
    //     nombre: string
    // },
    producto: {
        id: number;
        marca: string;
        modelo: string;
    };
};

export async function findAjusteInventario(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM ajustesInventario WHERE id = ?", [id]);

        return [dataRes[0], dataField];
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
            [
                ajusteInventario.operadorId,
                ajusteInventario.fecha,
                ajusteInventario.productoId,
                ajusteInventario.tipo,
                ajusteInventario.cantidad,
                ajusteInventario.motivo,
                id,
            ],
        );

        return [dataRes[0], dataField];
    });

    return data as AjusteInventario | null;
}
