import { ResultSetHeader } from "mysql2";
import { calcularStocksTodosQuery } from ".";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { MOVIMIENTO_INVENTARIO_TIPO, OrdenCompra, OrdenCompraItem, PRODUCTO_ESTADO } from "./shared";
import { formatForSql } from "./utils";

export interface NewOrdenCompraItem {
    almacenId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}

export async function createOrdenCompra(
    proveedorId: number,
    fecha: Date,
    operadorId: number,
    items: NewOrdenCompraItem[],
) {
    const fechaSql = formatForSql(fecha);

    return await runQuery(async function (connection) {
        await connection.beginTransaction();

        const [insertOrdenResult] = await connection.query(
            "INSERT INTO ordenesCompra (proveedorId, fecha, operadorId) VALUES (?, ?, ?)",
            [proveedorId, fechaSql, operadorId],
        );

        const ordenId = (insertOrdenResult as ResultSetHeader).insertId;
        const insertItemsSql = await connection.prepare(
            `INSERT INTO ordenesCompraItems (ordenId, almacenId, productoId, cantidad, precioUnitario, total) VALUES (?, ?, ?, ?, ?, ?)`,
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
                    ordenCompraId,
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
                .map((item) =>
                    insertItemsSql.execute([
                        ordenId,
                        item.almacenId,
                        item.productoId,
                        item.cantidad,
                        item.precioUnitario,
                        item.cantidad * item.precioUnitario,
                    ]),
                )
                .concat(
                    items.map((item) =>
                        movimientosSql.execute([
                            fechaSql,
                            operadorId,
                            item.almacenId,
                            item.productoId,
                            PRODUCTO_ESTADO.BUENO,
                            MOVIMIENTO_INVENTARIO_TIPO.ENTRADA,
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
                            item.cantidad,
                            item.cantidad,
                        ]),
                    ),
                ),
        );

        await connection.commit();

        return ordenId;
    });
}

export async function getOrdenesCompra(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ordenesCompra");

        const [dataRes, dataField] = await connection.query("SELECT * FROM ordenesCompra LIMIT ?, ?", [offset, limit]);

        return [countRes[0].total, dataRes];
    });

    return {
        data: data as OrdenCompra[],
        total: total as number,
    };
}

export async function getOrdenesCompraWithRelations(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ordenesCompra");

        const [dataRes, dataField] = await connection.query(
            `SELECT 
                ordenesCompra.* ,
                usuarios.nombre as operador_nombre,
                proveedores.nombre as proveedor_nombre
            FROM ordenesCompra 
            JOIN proveedores ON ordenesCompra.proveedorId = proveedores.id
            JOIN usuarios ON ordenesCompra.operadorId = usuarios.id
            ORDER BY fecha DESC
            LIMIT ?, ?
        `,
            [offset, limit],
        );

        return [countRes[0].total, dataRes];
    });

    return {
        data: (data as Record<string, any>[]).map((orden) => ({
            id: orden.id,
            operadorId: orden.operadorId,
            operador: {
                id: orden.operadorId,
                nombre: orden.operador_nombre,
            },
            proveedorId: orden.proveedorId,
            proveedor: {
                id: orden.proveedorId,
                nombre: orden.proveedor_nombre,
            },
            fecha: orden.fecha,
        })),
        total: total as number,
    };
}

export async function findOrdenCompra(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM ordenesCompra WHERE id = ?", [id]);

        return [dataRes[0], dataField];
    });

    return data as OrdenCompra | null;
}

export async function deleteOrdenCompra(id: number) {
    await runQuery(async function (connection) {
        await connection.query("DELETE FROM ordenesCompraItems WHERE ordenId = ?", [id]);
        await connection.query("DELETE FROM ordenesCompra WHERE id = ?", [id]);

        await calcularStocksTodosQuery(connection);
    });
}

export async function findOrdenCompraWithRelations(id: number) {
    const [orden, ordenField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `SELECT
                ordenesCompra.*,
                usuarios.nombre as operador_nombre,
                proveedores.nombre as proveedor_nombre
            FROM ordenesCompra 
            JOIN proveedores ON ordenesCompra.proveedorId = proveedores.id
            JOIN usuarios ON ordenesCompra.operadorId = usuarios.id
            WHERE ordenesCompra.id = ?`,
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
        proveedorId: orden.proveedorId,
        proveedor: {
            id: orden.proveedorId,
            nombre: orden.proveedor_nombre,
        },
        fecha: orden.fecha,
    };
}

export async function getOrdenCompraItems(ordenId: number) {
    const [items, ordenField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(`SELECT * FROM ordenesCompraItems WHERE ordenId = ?`, [
            ordenId,
        ]);

        return [dataRes, dataField];
    });

    return items as OrdenCompraItem[];
}

export async function getOrdenCompraItemsWithRelations(ordenId: number) {
    const [items, ordenField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `SELECT
                ordenesCompraItems.* ,
                almacenes.nombre as almacen_nombre,
                productos.marca as producto_marca,
                productos.modelo as producto_modelo
            FROM ordenesCompraItems 
            JOIN almacenes ON ordenesCompraItems.almacenId = almacenes.id
            JOIN productos ON ordenesCompraItems.productoId = productos.id
            WHERE ordenesCompraItems.ordenId = ?`,
            [ordenId],
        );

        return [dataRes, dataField];
    });

    return (items as (OrdenCompraItem & Record<string, unknown>)[]).map((o) => ({
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
        precioUnitario: o.precioUnitario,
        total: o.total,
    }));
}

export async function updateOrdenCompra(
    id: number,
    modificado: Omit<OrdenCompra, "id" | "operadorId">,
    operadorId: number,
) {
    await runQuery(async function (connection) {
        const fechaSql = formatForSql(modificado.fecha);
        const [dataRes, dataField] = await connection.query(
            `UPDATE ordenesCompra 
            SET 
                proveedorId = ?,
                fecha = ?,
                operadorId = ?
            WHERE id = ?`,
            [modificado.proveedorId, fechaSql, operadorId, id],
        );

        await connection.query(
            `UPDATE movimientosInventario 
                SET 
                    fecha = ?,
                    operadorId = ?
                WHERE ordenCompraId = ?`,
            [fechaSql, operadorId, id],
        );

        return [dataRes[0], dataField];
    });
}

export async function findOrdenCompraItem(itemId: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM ordenesCompraItems WHERE id = ?", [itemId]);

        return [dataRes[0], dataField];
    });

    return data as OrdenCompraItem | null;
}

export async function createOrdenCompraItem(
    ordenId: number,
    nuevo: Omit<OrdenCompraItem, "id" | "total">,

    operadorId: number,
) {
    const orden = (await findOrdenCompra(ordenId)) as OrdenCompra;
    const fechaSql = formatForSql(orden.fecha as unknown as Date);
    await runQuery(async function (connection) {
        await connection.query(
            `INSERT INTO ordenesCompraItems (ordenId, almacenId, productoId, cantidad, precioUnitario, total) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                ordenId,
                nuevo.almacenId,
                nuevo.productoId,
                nuevo.cantidad,
                nuevo.precioUnitario,
                nuevo.cantidad * nuevo.precioUnitario,
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
                    ordenCompraId,
                    cantidad,
                    fueEditada
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
                    ?,
                    1
                )`,
            [
                fechaSql,
                operadorId,
                nuevo.almacenId,
                nuevo.productoId,
                PRODUCTO_ESTADO.BUENO,
                MOVIMIENTO_INVENTARIO_TIPO.ENTRADA,
                ordenId,
                nuevo.cantidad,
            ],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [nuevo.almacenId, nuevo.productoId, PRODUCTO_ESTADO.BUENO, nuevo.cantidad, nuevo.cantidad],
        );
    });
}

export async function updateOrdenCompraItem(
    itemId: number,
    modificado: Omit<OrdenCompraItem, "id" | "ordenId">,

    operadorId: number,
) {
    const anterior = (await findOrdenCompraItem(itemId)) as OrdenCompraItem;
    await runQuery(async function (connection) {
        await connection.query(
            `UPDATE ordenesCompraItems 
            SET 
                almacenId = ?,
                productoId = ?,
                cantidad = ?,
                precioUnitario = ?,
                total = ?
            WHERE id = ?`,
            [
                modificado.almacenId,
                modificado.productoId,
                modificado.cantidad,
                modificado.precioUnitario,
                modificado.cantidad * modificado.precioUnitario,
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
                WHERE ordenCompraId = ? AND productoId = ? AND estadoDestino = ?`,
            [
                operadorId,
                modificado.almacenId,
                modificado.productoId,
                PRODUCTO_ESTADO.BUENO,
                modificado.cantidad,
                anterior.ordenId,
                anterior.productoId,
                PRODUCTO_ESTADO.BUENO,
            ],
        );

        // await calcularStocksTodosQuery(connection);

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad)
            VALUES (?, ?, ?, -1 * ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad - ?`,
            [anterior.almacenId, anterior.productoId, PRODUCTO_ESTADO.BUENO, anterior.cantidad, anterior.cantidad],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [
                modificado.almacenId,
                modificado.productoId,
                PRODUCTO_ESTADO.BUENO,
                modificado.cantidad,
                modificado.cantidad,
            ],
        );
    });

    return anterior.ordenId;
}

export async function deleteOrdenCompraItem(itemId: number) {
    const anterior = (await findOrdenCompraItem(itemId)) as OrdenCompraItem;
    await runQuery(async function (connection) {
        await connection.query(`DELETE FROM ordenesCompraItems WHERE id = ?`, [itemId]);

        await connection.query(
            `DELETE FROM movimientosInventario 
                WHERE 
                    almacenDestinoId = ? AND
                    productoId = ? AND
                    estadoDestino = ? AND
                    cantidad = ? AND
                    ordenCompraId = ?`,
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
