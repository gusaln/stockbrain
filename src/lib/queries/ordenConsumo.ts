import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { MOVIMIENTO_INVENTARIO_TIPO, OrdenConsumo, OrdenConsumoItem, PRODUCTO_ESTADO } from "./shared";
import { formatForSql } from "./utils";
import { calcularStocksTodosQuery } from ".";

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

export async function deleteOrdenConsumo(id: number) {
    await runQuery(async function (connection) {
        await connection.query("DELETE FROM ordenesConsumoItems WHERE ordenId = ?", [id]);
        await connection.query("DELETE FROM ordenesConsumo WHERE id = ?", [id]);

        await calcularStocksTodosQuery(connection);
    });
}

export async function findOrdenConsumoWithRelations(id: number) {
    const [orden, ordenField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `SELECT
                ordenesConsumo.*,
                usuarios.nombre as operador_nombre
            FROM ordenesConsumo 
            JOIN usuarios ON ordenesConsumo.operadorId = usuarios.id
            WHERE ordenesConsumo.id = ?`,
            [id],
        );

        return [dataRes[0], dataField];
    });

    if (!orden) {
        return null;
    }

    return {
        id: orden.id,
        operadorId: orden.operadorId,
        operador: {
            id: orden.operadorId,
            nombre: orden.operador_nombre,
        },
        descripcion: orden.descripcion,
        fecha: orden.fecha,
    };
}

export async function getOrdenConsumoItems(ordenId: number) {
    const [items, ordenField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(`SELECT * FROM ordenesConsumoItems WHERE ordenId = ?`, [
            ordenId,
        ]);

        return [dataRes, dataField];
    });

    return items as OrdenConsumoItem[];
}

export async function getOrdenConsumoItemsWithRelations(ordenId: number) {
    const [items, ordenField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `SELECT
                ordenesConsumoItems.* ,
                almacenes.nombre as almacen_nombre,
                productos.marca as producto_marca,
                productos.modelo as producto_modelo
            FROM ordenesConsumoItems 
            JOIN almacenes ON ordenesConsumoItems.almacenId = almacenes.id
            JOIN productos ON ordenesConsumoItems.productoId = productos.id
            WHERE ordenesConsumoItems.ordenId = ?`,
            [ordenId],
        );

        return [dataRes, dataField];
    });

    return (items as (OrdenConsumoItem & Record<string, unknown>)[]).map((o) => ({
        id: o.id,
        ordenId: o.ordenId,
        almacen: {
            id: o.almacenId,
            nombre: o.almacen_nombre as string,
        },
        productoId: o.productoId,
        producto: {
            id: o.productoId,
            marca: o.producto_marca as string,
            modelo: o.producto_modelo as string,
        },
        cantidad: o.cantidad,
    }));
}

export async function updateOrdenConsumo(
    id: number,
    modificado: Omit<OrdenConsumo, "id" | "operadorId">,
    operadorId: number,
) {
    await runQuery(async function (connection) {
        const fechaSql = formatForSql(modificado.fecha);
        const [dataRes, dataField] = await connection.query(
            `UPDATE ordenesConsumo 
            SET 
                motivo = ?,
                fecha = ?,
                operadorId = ?
            WHERE id = ?`,
            [modificado.descripcion, fechaSql, operadorId, id],
        );

        await connection.query(
            `UPDATE movimientosInventario 
                SET 
                    fecha = ?,
                    operadorId = ?
                WHERE ordenConsumoId = ?`,
            [fechaSql, operadorId, id],
        );

        return [dataRes[0], dataField];
    });
}

export async function findOrdenConsumoItem(itemId: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM ordenesConsumoItems WHERE id = ?", [itemId]);

        return [dataRes[0], dataField];
    });

    return data as OrdenConsumoItem | null;
}


export async function createOrdenConsumoItem(
    ordenId: number,
    nuevo: Omit<OrdenConsumoItem, "id" | "total">,

    operadorId: number,
) {
    const orden = (await findOrdenConsumo(ordenId)) as OrdenConsumo;
    const fechaSql = formatForSql(orden.fecha as unknown as Date);
    await runQuery(async function (connection) {
        await connection.query(
            `INSERT INTO ordenesConsumoItems (ordenId, almacenId, productoId, cantidad) VALUES (?, ?, ?, ?)`,
            [
                ordenId,
                nuevo.almacenId,
                nuevo.productoId,
                nuevo.cantidad,
            ],
        );

        await connection.query(
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
            [
                fechaSql,
                operadorId,
                nuevo.almacenId,
                nuevo.productoId,
                PRODUCTO_ESTADO.BUENO,
                MOVIMIENTO_INVENTARIO_TIPO.SALIDA,
                ordenId,
                -nuevo.cantidad,
            ],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [nuevo.almacenId, nuevo.productoId, PRODUCTO_ESTADO.BUENO, -nuevo.cantidad, -nuevo.cantidad],
        );
    });
}

export async function updateOrdenConsumoItem(
    itemId: number,
    modificado: Omit<OrdenConsumoItem, "id" | "ordenId">,

    operadorId: number,
) {
    const anterior = (await findOrdenConsumoItem(itemId)) as OrdenConsumoItem;
    await runQuery(async function (connection) {
        await connection.query(
            `UPDATE ordenesConsumoItems 
            SET 
                almacenId = ?,
                productoId = ?,
                cantidad = ?
            WHERE id = ?`,
            [
                modificado.almacenId,
                modificado.productoId,
                modificado.cantidad,
                itemId,
            ],
        );

        await connection.query(
            `UPDATE movimientosInventario 
                SET    
                    operadorId = ?,
                    almacenDestinoId = ?,
                    productoId = ?,
                    estadoDestino = ?,
                    cantidad = ?,
                    fueEditada = 1
                WHERE ordenConsumoId = ? AND productoId = ? AND estadoDestino = ?`,
            [
                operadorId,
                modificado.almacenId,
                modificado.productoId,
                PRODUCTO_ESTADO.BUENO,
                -modificado.cantidad,
                anterior.ordenId,
                anterior.productoId,
                PRODUCTO_ESTADO.BUENO,
            ],
        );

        await calcularStocksTodosQuery(connection);

        // await connection.query(
        //     `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad)
        //     VALUES (?, ?, ?, -1 * ?)
        //     ON DUPLICATE KEY UPDATE cantidad = cantidad - ?`,
        //     [anterior.almacenId, anterior.productoId, PRODUCTO_ESTADO.BUENO, -anterior.cantidad, anterior.cantidad],
        // );

        // await connection.query(
        //     `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad)
        //     VALUES (?, ?, ?, ?)
        //     ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
        //     [
        //         modificado.almacenId,
        //         modificado.productoId,
        //         PRODUCTO_ESTADO.BUENO,
        //         modificado.cantidad,
        //         modificado.cantidad,
        //     ],
        // );
    });

    return anterior.ordenId;
}

export async function deleteOrdenConsumoItem(itemId: number) {
    const anterior = (await findOrdenConsumoItem(itemId)) as OrdenConsumoItem;
    await runQuery(async function (connection) {
        await connection.query(`DELETE FROM ordenesConsumoItems WHERE id = ?`, [itemId]);

        await connection.query(
            `DELETE FROM movimientosInventario 
                WHERE 
                    almacenDestinoId = ? AND
                    productoId = ? AND
                    estadoDestino = ? AND
                    cantidad = ? AND
                    ordenConsumoId = ?`,
            [anterior.almacenId, anterior.productoId, PRODUCTO_ESTADO.BUENO, anterior.cantidad, anterior.ordenId],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, -1 * ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad - ?`,
            [anterior.almacenId, anterior.productoId, PRODUCTO_ESTADO.BUENO, anterior.cantidad, anterior.cantidad],
        );
    });

    return anterior.ordenId;
}