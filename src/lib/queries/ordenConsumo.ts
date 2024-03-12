import { ResultSetHeader } from "mysql2";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { OrdenConsumo } from "./shared";

export async function createOrdenConsumo(
    descripcion: string,
    fecha: string,
    operadorId: number,
) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "INSERT INTO ordenesConsumo (descripcion, fecha, operadorId) VALUES (?, ?, ?)",
            [descripcion, fecha, operadorId]
        );
    })

    return (result as ResultSetHeader).insertId;
}

export async function existsOrdenConsumo(ordenConsumoId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "SELECT COUNT(id) as total FROM ordenesConsumo WHERE id = ?",
            [ordenConsumoId]
        );
    })

    return (result[0]).total > 0;
}

export async function getOrdenesConsumo(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM ordenesConsumo");

        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM ordenesConsumo LIMIT ?, ?",
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: data as OrdenConsumo[],
        total: total as number
    }
}

export async function findOrdenConsumo(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM ordenesConsumo WHERE id = ?",
            [id]
        );

        return [dataRes[0], dataField]
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
            [ordenConsumo.descripcion, ordenConsumo.fecha, ordenConsumo.operadorId, id]
        );

        return [dataRes[0], dataField]
    });

    return data as OrdenConsumo | null;
}