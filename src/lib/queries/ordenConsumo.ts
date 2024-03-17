import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { MOVIMIENTO_INVENTARIO_TIPO, OrdenConsumo, PRODUCTO_ESTADO } from "./shared";
import { formatForSql } from "./utils";

export interface NewOrdenConsumoItem {
    almacenId: number;
    productoId: number;
    cantidad: number;
}

export async function createOrdenConsumo(
    descripcion: string,
    fecha: Date,
    operadorId: number,
    items: NewOrdenConsumoItem[],
) {
    const fechaSql = formatForSql(fecha);

    return await runQuery(async function (connection) {
        await connection.beginTransaction();

        const [insertOrdenResult] = await connection.query(
            "INSERT INTO ordenesConsumo (descripcion, fecha, operadorId) VALUES (?, ?, ?)",
            [descripcion, fechaSql, operadorId],
        );

        const ordenId = (insertOrdenResult as ResultSetHeader).insertId;
        const insertItemsSql = await connection.prepare(
            `INSERT INTO ordenesConsumoItems (ordenId, almacenId, productoId, cantidad) VALUES (?, ?, ?, ?)`,
        );

        const movimientosSql = await connection.prepare(
            `INSERT INTO movimientosInventario 
                (   
                    fecha,
                    operadorId,
                    almacenDestinoId,
                    productoId,
                    estadoDestino,
                    tipo,
                    ordenConsumoId,
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
                    ?,
                    ?
                )`,
        );

        const productosStockSql = await connection.prepare(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
        );

        await Promise.all(
            items
                .map((item) => insertItemsSql.execute([ordenId, item.almacenId, item.productoId, item.cantidad]))
                .concat(
                    items.map((item) =>
                        movimientosSql.execute([
                            fechaSql,
                            operadorId,
                            item.almacenId,
                            item.productoId,
                            PRODUCTO_ESTADO.BUENO,
                            MOVIMIENTO_INVENTARIO_TIPO.SALIDA,
                            ordenId,
                            item.cantidad,
                        ]),
                    ),
                )
                .concat(
                    items.map((item) =>
                        productosStockSql.execute([
                            item.almacenId,
                            item.productoId,
                            PRODUCTO_ESTADO.BUENO,
                            -item.cantidad,
                            -item.cantidad,
                        ]),
                    ),
                ),
        );

        await connection.commit();

        return ordenId;
    });
}

export async function existsOrdenConsumo(ordenConsumoId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query("SELECT COUNT(id) as total FROM ordenesConsumo WHERE id = ?", [ordenConsumoId]);
    });

    return result[0].total > 0;
}

export async function getOrdenesConsumoWithRelations(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ordenesConsumo");

        const [dataRes, dataField] = await connection.query(
            `SELECT 
                ordenesConsumo.* ,
                usuarios.nombre as operador_nombre
            FROM ordenesConsumo 
            JOIN usuarios ON ordenesConsumo.operadorId = usuarios.id
            ORDER BY fecha DESC
            LIMIT ?, ?
        `,
            [offset, limit],
        );

        return [countRes[0].total, dataRes];
    });

    return {
        data: (data as Record<string, any>[]).map((movimiento) => ({
            id: movimiento.id,
            descripcion: movimiento.descripcion,
            operadorId: movimiento.operadorId,
            operador: {
                id: movimiento.operadorId,
                nombre: movimiento.operador_nombre,
            },
            fecha: movimiento.fecha,
        })),
        total: total as number,
    };
}

export async function findOrdenConsumo(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM ordenesConsumo WHERE id = ?", [id]);

        return [dataRes[0], dataField];
    });

    return data as OrdenConsumo | null;
}

export async function updateOrdenConsumo(id: number, ordenConsumo: Exclude<OrdenConsumo, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE ordenesConsumo 
            SET 
                descripcion = ?,
                fecha = ?,
                operadorId = ?
            WHERE id = ?`,
            [ordenConsumo.descripcion, ordenConsumo.fecha, ordenConsumo.operadorId, id],
        );

        return [dataRes[0], dataField];
    });

    return data as OrdenConsumo | null;
}
