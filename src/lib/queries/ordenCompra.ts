import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { MOVIMIENTO_INVENTARIO_TIPO, OrdenCompra, PRODUCTO_ESTADO } from "./shared";
import { formatForSql } from "./utils";

export interface NewOrdenCompraItem {
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
            `INSERT INTO ordenesCompraItems (ordenId, productoId, cantidad, precioUnitario, total) VALUES (?, ?, ?, ?, ?)`,
        );

        const movimientosSql = await connection.prepare(
            `INSERT INTO movimientosInventario 
                (   
                    fecha,
                    operadorId,
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
                    ?
                )`,
        );

        const productosStockSql = await connection.prepare(
            `INSERT INTO productoStocks (productoId, estado, cantidad) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
        );

        await Promise.all(
            items
                .map((item) =>
                    insertItemsSql.execute([
                        ordenId,
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

export async function existsOrdenCompra(ordenCompraId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query("SELECT COUNT(id) as total FROM ordenesCompra WHERE id = ?", [ordenCompraId]);
    });

    return result[0].total > 0;
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
        data: (data as Record<string, any>[]).map((movimiento) => ({
            id: movimiento.id,
            operadorId: movimiento.operadorId,
            operador: {
                id: movimiento.operadorId,
                nombre: movimiento.operador_nombre,
            },
            proveedorId: movimiento.proveedorId,
            proveedor: {
                id: movimiento.proveedorId,
                nombre: movimiento.proveedor_nombre,
            },
            fecha: movimiento.fecha,
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

export async function updateOrdenCompra(id: number, ordenCompra: Exclude<OrdenCompra, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE ordenesCompra 
            SET 
                proveedorId = ?,
                fecha = ?,
                operadorId = ?
            WHERE id = ?`,
            [ordenCompra.proveedorId, ordenCompra.fecha, ordenCompra.operadorId, id],
        );

        return [dataRes[0], dataField];
    });

    return data as OrdenCompra | null;
}
