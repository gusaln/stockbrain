import { calcularStocksDeUnoQuery, calcularStocksTodosQuery } from ".";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import {
    MOVIMIENTO_INVENTARIO_TIPO,
    MovimientoInventario,
    MovimientoInventarioTipo,
    MovimientoInventarioTipoLabelMap,
    ProductoEstado,
    Transferencia,
} from "./shared";
import { formatForSql } from "./utils";

export async function createTransferencia(
    operadorId: number,
    fecha: Date,
    almacenOrigenId: number,
    almacenDestinoId: number,
    productoId: number,
    estadoOrigen: ProductoEstado,
    estadoDestino: ProductoEstado,
    cantidad: number,
) {
    const fechaSql = formatForSql(fecha);

    await runQuery(async function (connection) {
        await connection.query(
            `INSERT INTO movimientosInventario 
                (   
                    fecha,
                    operadorId,
                    almacenOrigenId,
                    almacenDestinoId,
                    productoId,
                    estadoOrigen,
                    estadoDestino,
                    tipo,
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
                almacenOrigenId,
                almacenDestinoId,
                productoId,
                estadoOrigen,
                estadoDestino,
                MOVIMIENTO_INVENTARIO_TIPO.TRANSFERENCIA,
                cantidad,
            ],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [almacenOrigenId, productoId, estadoOrigen, -cantidad, -cantidad],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [almacenDestinoId, productoId, estadoDestino, cantidad, cantidad],
        );
    });
}


export async function findTransferencia(id: number) {
    const [transferencia, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM movimientosInventario WHERE tipo = ? AND id = ?",
            [MOVIMIENTO_INVENTARIO_TIPO.TRANSFERENCIA, id],
        );

        return [dataRes[0], dataField];
    });

    return transferencia as Transferencia | null;
}

export async function updateTransferencia(
    id: number,
    modificado: Omit<MovimientoInventario, "id">,
    operadorId: number,
) {
    const fechaSql = formatForSql(modificado.fecha);
    const anterior = (await findTransferencia(id)) as Transferencia;

    await runQuery(async function (connection) {
        await connection.query(
            `UPDATE movimientosInventario 
            SET     
                fecha = ?,
                operadorId = ?,
                almacenOrigenId = ?,
                almacenDestinoId = ?,
                productoId = ?,
                estadoOrigen = ?,
                estadoDestino = ?,
                cantidad = ?
            WHERE id = ?`,
            [
                fechaSql,
                operadorId,
                modificado.almacenOrigenId,
                modificado.almacenDestinoId,
                modificado.productoId,
                modificado.estadoOrigen,
                modificado.estadoDestino,
                modificado.cantidad,
                id,
            ],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [
                anterior.almacenOrigenId,
                anterior.productoId,
                anterior.estadoOrigen,
                anterior.cantidad,
                anterior.cantidad,
            ],
        );
        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [
                anterior.almacenDestinoId,
                anterior.productoId,
                anterior.estadoDestino,
                -anterior.cantidad,
                -anterior.cantidad,
            ],
        );

        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [
                modificado.almacenOrigenId,
                modificado.productoId,
                modificado.estadoOrigen,
                -modificado.cantidad,
                -modificado.cantidad,
            ],
        );
        await connection.query(
            `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
            [
                modificado.almacenDestinoId,
                modificado.productoId,
                modificado.estadoDestino,
                modificado.cantidad,
                modificado.cantidad,
            ],
        );
    });
}

export async function deleteTransferencia(id: number) {
    await runQuery(async function (connection) {
        await connection.query(`DELETE FROM movimientosInventario WHERE id = ?`, [id]);

        await calcularStocksTodosQuery(connection);
    });
}

export async function getTransferenciasWithRelations(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query(
            "SELECT COUNT(id) as total FROM movimientosInventario WHERE tipo = ?",
            [MOVIMIENTO_INVENTARIO_TIPO.TRANSFERENCIA],
        );

        const [dataRes, dataField] = await connection.query(
            `SELECT movimientosInventario.*,
            usuarios.nombre as operador_nombre,
                aOrigen.nombre as almacen_origen_nombre,
                aDestino.nombre as almacen_destino_nombre,
                productos.marca as producto_marca,
                productos.modelo as producto_modelo
            FROM movimientosInventario 
            JOIN usuarios ON movimientosInventario.operadorId = usuarios.id
            JOIN almacenes AS aOrigen ON movimientosInventario.almacenOrigenId = aOrigen.id
            JOIN almacenes AS aDestino ON movimientosInventario.almacenDestinoId = aDestino.id
            JOIN productos ON movimientosInventario.productoId = productos.id
            ORDER BY movimientosInventario.fecha DESC, movimientosInventario.id DESC
            WHERE tipo = ?
            LIMIT ?, ? `,
            [MOVIMIENTO_INVENTARIO_TIPO.TRANSFERENCIA, offset, limit],
        );

        return [countRes[0].total, dataRes];
    });

    return {
        data: (data as MovimientoInventario[]).map((movimiento) => ({
            id: movimiento.id,
            fecha: movimiento.fecha,
            operadorId: movimiento.operadorId,
            operador: {
                id: movimiento.operadorId,
                nombre: movimiento.operador_nombre,
            },
            almacenOrigenId: movimiento.almacenOrigenId,
            almacenOrigen: {
                id: movimiento.almacenOrigenId,
                nombre: movimiento.almacen_origen_nombre,
            },
            almacenDestinoId: movimiento.almacenDestinoId,
            almacenDestino: {
                id: movimiento.almacenDestinoId,
                nombre: movimiento.almacen_destino_nombre,
            },
            productoId: movimiento.productoId,
            producto: {
                id: movimiento.productoId,
                marca: movimiento.producto_marca,
                modelo: movimiento.producto_modelo,
            },
            estadoOrigen: movimiento.estadoOrigen,
            estadoDestino: movimiento.estadoDestino,
            cantidad: movimiento.cantidad,
        })),
        total: total as number,
    };
}
