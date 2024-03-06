import { runQuery } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { Pagination } from "./pagination";

export interface Proveedor {
    id: number;
    nombre: string;
    /** Persona de contacto en el proveedor */
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
}

export async function createProveedor(
    nombre: string,
    contacto: string,
    telefono: string,
    email: string,
    direccion: string,
) {
    const [result] = await runQuery(async function(connection) {
        return await connection.query(
            "INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
            [nombre, contacto, telefono, email, direccion]
        );
    })
    
    return (result as ResultSetHeader).insertId;
}

export async function getProveedores(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10
    const offset = ((pagination.page ?? 1) - 1) * limit
    const [total, data] = await runQuery(async function(connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM proveedores");

        const [dataRes, dataField] = await connection.query(
            "SELECT * FROM proveedores LIMIT ?, ?",
            [offset, limit]
        );

        return [countRes[0].total, dataRes]
    });

    return {
        data: data as Proveedor[],
        total: total as number
    }
}
