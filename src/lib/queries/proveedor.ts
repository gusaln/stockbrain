import { runQuery } from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { Pagination } from "./pagination";
import { Proveedor } from "./shared";

export async function createProveedor(
    nombre: string,
    contacto: string,
    telefono: string,
    email: string,
    direccion: string,
) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query(
            "INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
            [nombre, contacto, telefono, email, direccion],
        );
    });

    return (result as ResultSetHeader).insertId;
}

export async function getProveedores(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM proveedores");

        const [dataRes, dataField] = await connection.query("SELECT * FROM proveedores LIMIT ?, ?", [offset, limit]);

        return [countRes[0].total, dataRes];
    });

    return {
        data: data as Proveedor[],
        total: total as number,
    };
}

export async function findProveedor(id: number) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query("SELECT * FROM proveedores WHERE id = ?", [id]);

        return [dataRes[0], dataField];
    });

    return data as Proveedor | null;
}

export async function updateProveedor(id: number, proveedor: Omit<Proveedor, "id">) {
    const [data, dataField] = await runQuery(async function (connection) {
        const [dataRes, dataField] = await connection.query(
            `UPDATE proveedores 
            SET 
                nombre = ?, 
                contacto = ?, 
                telefono = ?, 
                email = ?, 
                direccion = ?
            WHERE id = ?`,
            [proveedor.nombre, proveedor.contacto, proveedor.telefono, proveedor.email, proveedor.direccion, id],
        );

        return [dataRes[0], dataField];
    });

    return data as Proveedor | null;
}

export async function isProveedorUsed(proveedorId: number) {
    const [result] = await runQuery(async function (connection) {
        return await connection.query("SELECT COUNT(id) as total FROM ordenesCompra WHERE proveedorId = ?", [
            proveedorId,
        ]);
    });

    return result[0].total > 0;
}
