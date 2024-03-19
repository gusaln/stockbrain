import { groupBy } from "lodash";
import { Connection, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import {
    MovimientoInventario,
    MovimientoInventarioTipoLabelMap,
    PRODUCTO_ESTADO,
    Producto,
    ProductoStock,
} from "./shared";

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
            [categoriaId, marca, modelo, descripcion, imagen],
        );
    });

    return (result as ResultSetHeader).insertId;
}

export async function calcularStocksDeUnoQuery(connection: PoolConnection | Connection, productoId: number) {
    // const insert = await connection.prepare(
    //     `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad)
    //     VALUES (?, ?, ?, 0)
    //     ON DUPLICATE KEY UPDATE cantidad = 0`,
    // );

    // await Promise.all(Object.values(PRODUCTO_ESTADO).map((estado) => insert.execute([almacenId, productoId, estado])));

    // Calculamos el stock actual con los movimientos
    await connection.query(
        `UPDATE productoStocks 
    LEFT JOIN (
        SELECT 
            m.almacenDestinoId as almacenId, 
            m.productoId, 
            m.estadoDestino as estado, 
            SUM(m.cantidad) as cantidad 
        FROM movimientosInventario as m
        WHERE 
            m.productoId = ?
        GROUP BY 
            m.almacenDestinoId, 
            m.productoId, 
            m.estadoDestino
    ) AS m_groupby ON 
        m_groupby.almacenId = productoStocks.almacenId AND 
        m_groupby.productoId = productoStocks.productoId AND 
        m_groupby.estado = productoStocks.estado
    SET productoStocks.cantidad = IF(ISNULL(m_groupby.cantidad), 0, m_groupby.cantidad)`,
        [productoId],
    );

    // En las transferencias tenemos que remover los
    await connection.query(
        `UPDATE productoStocks 
    LEFT JOIN (
        SELECT 
            m.almacenOrigenId as almacenId, 
            m.productoId, 
            m.estadoOrigen as estado, 
            SUM(m.cantidad)*-1 as cantidad 
        FROM movimientosInventario as m
        WHERE 
            m.productoId = ? AND
            m.estadoOrigen IS NOT NULL
        GROUP BY 
            m.almacenOrigenId, 
            m.productoId, 
            m.estadoOrigen
    ) AS m_groupby ON 
        m_groupby.almacenId = productoStocks.almacenId AND 
        m_groupby.productoId = productoStocks.productoId AND 
        m_groupby.estado = productoStocks.estado
    SET productoStocks.cantidad = productoStocks.cantidad + IF(ISNULL(m_groupby.cantidad), 0, m_groupby.cantidad)`,
        [productoId],
    );
}

export async function calcularStocksTodosQuery(connection: PoolConnection | Connection) {
    // const insert = await connection.prepare(
    //     `INSERT INTO productoStocks (almacenId, productoId, estado, cantidad)
    //     VALUES (?, ?, ?, 0)
    //     ON DUPLICATE KEY UPDATE cantidad = 0`,
    // );

    // await Promise.all(Object.values(PRODUCTO_ESTADO).map((estado) => insert.execute([almacenId, productoId, estado])));

    // Calculamos el stock actual con los movimientos
    await connection.query(
        `UPDATE productoStocks 
    LEFT JOIN (
        SELECT 
            m.almacenDestinoId as almacenId, 
            m.productoId, 
            m.estadoDestino as estado, 
            SUM(m.cantidad) as cantidad 
        FROM movimientosInventario as m
        GROUP BY 
            m.almacenDestinoId, 
            m.productoId, 
            m.estadoDestino
    ) AS m_groupby ON 
        m_groupby.almacenId = productoStocks.almacenId AND 
        m_groupby.productoId = productoStocks.productoId AND 
        m_groupby.estado = productoStocks.estado
    SET productoStocks.cantidad = IF(ISNULL(m_groupby.cantidad), 0, m_groupby.cantidad)`,
        [],
    );

    // En las transferencias tenemos que remover los
    await connection.query(
        `UPDATE productoStocks 
    LEFT JOIN (
        SELECT 
            m.almacenOrigenId as almacenId, 
            m.productoId, 
            m.estadoOrigen as estado, 
            SUM(m.cantidad)*-1 as cantidad 
        FROM movimientosInventario as m
        WHERE 
            m.estadoOrigen IS NOT NULL
        GROUP BY 
            m.almacenOrigenId, 
            m.productoId, 
            m.estadoOrigen
    ) AS m_groupby ON 
        m_groupby.almacenId = productoStocks.almacenId AND 
        m_groupby.productoId = productoStocks.productoId AND 
        m_groupby.estado = productoStocks.estado
    SET productoStocks.cantidad = productoStocks.cantidad + IF(ISNULL(m_groupby.cantidad), 0, m_groupby.cantidad)`,
        [],
    );
}

export async function existsProducto(productoId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query("SELECT COUNT(id) as total FROM productos WHERE id = ?", [productoId]);
    });

    return result[0].total > 0;
}

export async function getProductos(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM productos");

        const [dataRes, dataField] = await connection.query("SELECT productos.* FROM productos LIMIT ?, ?", [
            offset,
            limit,
        ]);

        return [countRes[0].total, dataRes];
    });

    return {
        data: data as Producto[],
        total: total as number,
    };
}

export async function getProductosWithCategorias(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM productos");

        const [dataRes, dataField] = await connection.query(
            `SELECT productos.id, productos.*, categorias.nombre as categoria_nombre
            FROM productos 
            LEFT JOIN categorias ON productos.categoriaId = categorias.id
            LIMIT ?, ?`,
            [offset, limit],
        );

        return [countRes[0].total, dataRes];
    });

    return {
        data: (data as (Producto & { categoria_nombre: string })[]).map((p) => ({
            id: p.id,
            categoriaId: p.categoriaId,
            categoria: {
                id: p.categoriaId,
                nombre: p.categoria_nombre,
            },
            marca: p.marca,
            modelo: p.modelo,
            descripcion: p.descripcion,
            imagen: p.imagen,
        })),
        total: total as number,
    };
}

export async function findProducto(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM productos WHERE id = ?", [id]);

        return [dataRes[0], dataField];
    });

    return data as Producto | null;
}

export async function updateProducto(id: number, producto: Omit<Producto, "id">) {
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
            [producto.categoriaId, producto.marca, producto.modelo, producto.descripcion, producto.imagen, id],
        );

        return [dataRes[0], dataField];
    });

    return data as Producto | null;
}

export async function getProductoStocks(productoId: number) {
    const [data, dataField] = (await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `SELECT 
                productoId, 
                estado, 
                SUM(cantidad) as cantidad
            FROM productoStocks 
            WHERE productoId = ?
            GROUP BY productoId, estado
            `,
            [productoId],
        );

        return [dataRes as ProductoStock[], dataField];
    })) as [ProductoStock[], unknown];

    return {
        [PRODUCTO_ESTADO.BUENO]: data.find((s) => s.estado == PRODUCTO_ESTADO.BUENO)?.cantidad ?? 0,
        [PRODUCTO_ESTADO.REVISION]: data.find((s) => s.estado == PRODUCTO_ESTADO.REVISION)?.cantidad ?? 0,
        [PRODUCTO_ESTADO.DEFECTUOSO]: data.find((s) => s.estado == PRODUCTO_ESTADO.DEFECTUOSO)?.cantidad ?? 0,
    };
}

export async function getProductoStocksPorAlmacen(productoId: number) {
    const [data, dataField] = (await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `SELECT 
                almacenId, 
                almacenes.nombre as almacen_nombre, 
                productoId, 
                estado, 
                SUM(cantidad) as cantidad
            FROM productoStocks 
            LEFT JOIN almacenes ON productoStocks.almacenId = almacenes.id
            WHERE productoId = ?
            GROUP BY productoId, estado, almacenId
            `,
            [productoId],
        );

        return [dataRes as ProductoStock[], dataField];
    })) as [ProductoStock[], unknown];

    const groupByAlmacenId = groupBy(data, "almacenId");

    return Object.values(groupByAlmacenId).map((stocks) => {
        return {
            almacenId: stocks[0].almacenId,
            almacenNombre: stocks[0].almacen_nombre,
            [PRODUCTO_ESTADO.BUENO]: stocks.find((s) => s.estado == PRODUCTO_ESTADO.BUENO)?.cantidad ?? 0,
            [PRODUCTO_ESTADO.REVISION]: stocks.find((s) => s.estado == PRODUCTO_ESTADO.REVISION)?.cantidad ?? 0,
            [PRODUCTO_ESTADO.DEFECTUOSO]: stocks.find((s) => s.estado == PRODUCTO_ESTADO.DEFECTUOSO)?.cantidad ?? 0,
        };
    });
}

export async function getMovimientosInventarioDelProducto(productoId: number, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query(
            "SELECT COUNT(id) as total FROM movimientosInventario WHERE productoId = ?",
            [productoId],
        );

        const [dataRes, dataField] = await connection.query(
            `SELECT movimientosInventario.*,
                usuarios.nombre as operador_nombre,
                IF(ISNULL(almacenOrigenId), NULL, aOrigen.nombre) as almacen_origen_nombre,
                aDestino.nombre as almacen_destino_nombre
            FROM movimientosInventario 
            LEFT JOIN usuarios ON movimientosInventario.operadorId = usuarios.id
            LEFT JOIN almacenes AS aOrigen ON movimientosInventario.almacenOrigenId = aOrigen.id
            LEFT JOIN almacenes AS aDestino ON movimientosInventario.almacenDestinoId = aDestino.id
            WHERE productoId = ?
            ORDER BY fecha DESC, id DESC
            LIMIT ?, ?`,
            [productoId, offset, limit],
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
                nombre: movimiento.operador_nombre as string,
            },
            almacenOrigenId: movimiento.almacenOrigenId,
            almacenOrigen: movimiento.almacenOrigenId
                ? {
                      id: movimiento.almacenOrigenId,
                      nombre: movimiento.almacen_origen_nombre as string,
                  }
                : null,
            almacenDestinoId: movimiento.almacenDestinoId,
            almacenDestino: {
                id: movimiento.almacenDestinoId,
                nombre: movimiento.almacen_destino_nombre as string,
            },
            productoId: movimiento.productoId,
            estadoOrigen: movimiento.estadoOrigen,
            estadoDestino: movimiento.estadoDestino,
            tipo: movimiento.tipo,
            tipoNombre: MovimientoInventarioTipoLabelMap.get(movimiento.tipo),
            cantidad: movimiento.cantidad,
        })),
        total: total as number,
    };
}
export type MovimientoInventarioDeProductoWithRelations = Awaited<
    ReturnType<typeof getMovimientosInventarioDelProducto>
>["data"][number];
