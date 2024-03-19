import { ResultSetHeader } from "mysql2/promise";
import { runQuery } from "../db";
import { Pagination } from "./pagination";
import { Almacen } from "./shared";

export async function createAlmacen(nombre: string, ubicacion: string, encargado: string) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query("INSERT INTO categorias (nombre, ubicacion, encargado) VALUES (?, ?, ?)", [
            nombre,
            ubicacion,
            encargado,
        ]);
    });

    return (result as ResultSetHeader).insertId;
}

export async function existsAlmacen(almacenId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query("SELECT COUNT(id) as total FROM almacenes WHERE id = ?", [almacenId]);
    });

    return result[0].total > 0;
}

export async function countAlmacenes() {
    const [result] = await runQuery(async function (connection) {
        return await connection.query("SELECT COUNT(id) as total FROM almacenes");
    });

    return (result[0]?.total as number) ?? 0;
}

export async function getAlmacenes(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM almacenes");

        const [dataRes, dataField] = await connection.query("SELECT * FROM almacenes LIMIT ?, ?", [offset, limit]);

        return [countRes[0].total, dataRes];
    });

    return {
        data: data as Almacen[],
        total: total as number,
    };
}

export async function findAlmacen(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM almacenes WHERE id = ?", [id]);

        return [dataRes[0], dataField];
    });

    return data as Almacen | null;
}

export async function updateAlmacen(id: number, almacen: Omit<Almacen, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE almacenes 
            SET 
                nombre = ?, 
                ubicacion = ?
                encargado = ?
            WHERE id = ?`,
            [almacen.nombre, almacen.ubicacion, almacen.encargado, id],
        );

        return [dataRes[0], dataField];
    });

    return data as Almacen | null;
}
