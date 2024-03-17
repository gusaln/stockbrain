import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { MovimientoInventario, MovimientoInventarioTipoLabelMap } from "./shared";

// export async function createMovimientoInventario(
//     fecha: string,
//     operadorId: number,
//     productoId: number,
//     estadoOrigen: ProductoEstado | null,
//     estadoDestino: ProductoEstado,
//     tipo: MovimientoInventarioTipo,
//     relacionId: number | null,
//     cantidad: number,
//     motivo: string,
// ) {
//     const [result] = await runQuery(async function (connection) {
//         return await connection.query(
//             `INSERT INTO movimientosInventario (
//                 fecha, operadorId, productoId, estadoOrigen, estadoDestino, tipo, relacionId, cantidad
//             ) VALUES
//                 (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [fecha, operadorId, productoId, estadoOrigen, estadoDestino, tipo, relacionId, cantidad],
//         );
//     });

//     return (result as ResultSetHeader).insertId;
// }

export async function getMovimientosInventarioWithRelations(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query(
            "SELECT COUNT(id) as total FROM movimientosInventario",
            [],
        );

        const [dataRes, dataField] = await connection.query(
            `SELECT movimientosInventario.*,
            usuarios.nombre as operador_nombre,
                IF(ISNULL(almacenOrigenId), NULL, aOrigen.nombre) as almacen_origen_nombre,
                aDestino.nombre as almacen_destino_nombre,
                productos.marca as producto_marca,
                productos.modelo as producto_modelo
            FROM movimientosInventario 
            LEFT JOIN usuarios ON movimientosInventario.operadorId = usuarios.id
            LEFT JOIN almacenes AS aOrigen ON movimientosInventario.almacenOrigenId = aOrigen.id
            LEFT JOIN almacenes AS aDestino ON movimientosInventario.almacenDestinoId = aDestino.id
            LEFT JOIN productos ON movimientosInventario.productoId = productos.id
            ORDER BY movimientosInventario.fecha DESC, movimientosInventario.id DESC
            LIMIT ?, ?
            
            `,
            [offset, limit],
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
            almacenOrigen: movimiento.almacenOrigenId
                ? {
                      id: movimiento.almacenOrigenId,
                      nombre: movimiento.almacen_origen_nombre,
                  }
                : null,
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
            tipo: movimiento.tipo,
            tipoNombre: MovimientoInventarioTipoLabelMap.get(movimiento.tipo),
            cantidad: movimiento.cantidad,
        })),
        total: total as number,
    };
}

export async function findMovimientoInventario(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM movimientosInventario WHERE id = ?", [id]);

        return [dataRes[0], dataField];
    });

    return data as MovimientoInventario | null;
}

export async function updateMovimientoInventario(
    id: number,
    movimientoInventario: Exclude<MovimientoInventario, "id">,
) {
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
                id,
            ],
        );

        return [dataRes[0], dataField];
    });

    return data as MovimientoInventario | null;
}
