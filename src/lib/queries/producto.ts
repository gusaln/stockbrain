import { ResultSetHeader } from "mysql2/promise";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { PRODUCTO_ESTADO, MovimientoInventario, MovimientoInventarioTipoLabelMap } from "./shared";
import { Producto, ProductoStock } from "./shared";

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
            [
                categoriaId,
                marca,
                modelo,
                descripcion,
                imagen,
            ]
        );
    })

    return (result as ResultSetHeader).insertId;
}

export async function existsProducto(productoId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "SELECT COUNT(id) as total FROM productos WHERE id = ?",
            [productoId]
        );
    })

    return (result[0]).total > 0;
}

export async function getProductos(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM productos");

        const [dataRes, dataField] = await connection.query(
            "SELECT productos.* FROM productos LIMIT ?, ?",
            [offset, limit]
        );

        console.log(dataRes)

        return [countRes[0].total, dataRes]
    });

    return {
        data: data as Producto[],
        total: total as number
    }
}

export async function getProductosWithCategorias(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM productos");

        const [dataRes, dataField] = await connection.query(
            `SELECT productos.id, productos.*, categorias.nombre as categoria_nombre
            FROM productos 
            LEFT JOIN categorias ON productos.categoriaId = categorias.id
            LIMIT ?, ?`,
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: (data as (Producto & { categoria_nombre: string })[]).map((p) => ({
            id: p.id,
            categoriaId: p.categoriaId,
            categoria: {
                id: p.categoriaId,
                nombre: p.categoria_nombre
            },
            marca: p.marca,
            modelo: p.modelo,
            descripcion: p.descripcion,
            imagen: p.imagen,
        })),
        total: total as number
    }
}

export async function findProducto(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM productos WHERE id = ?",
            [id]
        );

        return [dataRes[0], dataField]
    });

    return data as Producto | null;
}

export async function updateProducto(id: number, producto: Exclude<Producto, "id">) {
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
            [producto.categoriaId, producto.marca, producto.modelo, producto.descripcion, producto.imagen, id]
        );

        return [dataRes[0], dataField]
    });

    return data as Producto | null;
}

export async function getProductoStocks(productoId: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM productoStocks WHERE productoId = ?",
            [productoId]
        );

        return [dataRes as ProductoStock[], dataField]
    }) as [ProductoStock[], unknown];

    return {
        [PRODUCTO_ESTADO.BUENO]: data.find(s => s.estado == PRODUCTO_ESTADO.BUENO)?.cantidad ?? 0,
        [PRODUCTO_ESTADO.REVISION]: data.find(s => s.estado == PRODUCTO_ESTADO.REVISION)?.cantidad ?? 0,
        [PRODUCTO_ESTADO.DEFECTUOSO]: data.find(s => s.estado == PRODUCTO_ESTADO.DEFECTUOSO)?.cantidad ?? 0,
    };
}


export async function getMovimientosInventarioDelProducto(productoId: number, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM movimientosInventario WHERE productoId = ?", [productoId]);

        const [dataRes, dataField] = await connection.query(
            `SELECT movimientosInventario.*,
                usuarios.nombre as operador_nombre
            FROM movimientosInventario 
            LEFT JOIN usuarios ON movimientosInventario.operadorId = usuarios.id
            WHERE productoId = ?
            LIMIT ?, ?`,
            [productoId, offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: (data as MovimientoInventario[]).map((movimiento) => ({
            id: movimiento.id,
            fecha: movimiento.fecha,
            operadorId: movimiento.operadorId,
            operador: {
                id: movimiento.operadorId,
                nombre: movimiento.operador_nombre
            },
            productoId: movimiento.productoId,
            estadoOrigen: movimiento.estadoOrigen,
            estadoDestino: movimiento.estadoDestino,
            tipo: movimiento.tipo,
            tipoNombre: MovimientoInventarioTipoLabelMap.get(movimiento.tipo),
            cantidad: movimiento.cantidad,
        })),
        total: total as number
    }
}
export type MovimientoInventarioDeProductoWithRelations = MovimientoInventario & {
    operador: {
        id: number,
        nombre: string
    };
}