import { runQuery } from "../db";

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

export async function createCategoria(
    nombre: string,
    descripcion: string,
) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
            [nombre, descripcion]
        );
    })

    return (result as ResultSetHeader).insertId;
}

export async function existsCategoria(categoriaId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "SELECT COUNT(id) as total FROM categorias WHERE id = ?",
            [categoriaId]
        );
    })

    return (result[0]).total > 0;
}

export async function getCategorias(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM categorias");

        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM categorias LIMIT ?, ?",
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: data as Categoria[],
        total: total as number
    }
}

export async function findCategoria(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM categorias WHERE id = ?",
            [id]
        );

        return [dataRes[0], dataField]
    });

    return data as Categoria | null;
}

export async function updateCategoria(id: number, categoria: Exclude<Categoria, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE categorias 
            SET 
                nombre = ?, 
                descripcion = ?
            WHERE id = ?`,
            [categoria.nombre, categoria.descripcion, id]
        );

        return [dataRes[0], dataField]
    });

    return data as Categoria | null;
}
