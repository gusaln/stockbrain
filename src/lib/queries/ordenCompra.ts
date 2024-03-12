import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { OrdenCompra } from "./shared";

export async function createOrdenCompra(
    proveedorId: number,
    fecha: string,
    operadorId: number,
) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "INSERT INTO ordenesCompra (proveedorId, fecha, operadorId) VALUES (?, ?, ?)",
            [proveedorId, fecha, operadorId]
        );
    })

    return (result as ResultSetHeader).insertId;
}

export async function existsOrdenCompra(ordenCompraId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "SELECT COUNT(id) as total FROM ordenesCompra WHERE id = ?",
            [ordenCompraId]
        );
    })

    return (result[0]).total > 0;
}

export async function getOrdenesCompra(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ordenesCompra");

        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM ordenesCompra LIMIT ?, ?",
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: data as OrdenCompra[],
        total: total as number
    }
}

export async function findOrdenCompra(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM ordenesCompra WHERE id = ?",
            [id]
        );

        return [dataRes[0], dataField]
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
            [ordenCompra.proveedorId, ordenCompra.fecha, ordenCompra.operadorId, id]
        );

        return [dataRes[0], dataField]
    });

    return data as OrdenCompra | null;
}
