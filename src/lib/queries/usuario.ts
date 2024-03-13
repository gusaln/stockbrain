import { createHash } from "crypto";
import { runQuery } from "../db";
import { Pagination } from "./pagination";

export const ROL = {
    administrador: 1,
    almacenero: 2,
} as const;
type RolEnum = typeof ROL;
type Rol = RolEnum[keyof RolEnum];
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    // password: string;
    rol: Rol;
}

export async function createUsuario(nombre: string, email: string, password: string, rol: Rol) {
    const hash = createHash("sha256");
    hash.update(password);

    const [result, fields] = await runQuery(async function (connection) {
        return connection.query("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ? ,?)", [
            nombre,
            email,
            hash.digest("hex"),
            rol,
        ]);
    });

    return;
}

export async function getUsuarios(search = undefined, pagination: Pagination = {}) {
    const limit = pagination.limit ?? 10;
    const offset = ((pagination.page ?? 1) - 1) * limit;
    const [total, data] = await runQuery(async function (connection) {
        const [countRes, countField] = await connection.query("SELECT COUNT(id) as total FROM usuarios");

        const [dataRes, dataField] = await connection.query("SELECT * FROM usuarios LIMIT ?, ?", [offset, limit]);

        return [countRes[0].total, dataRes];
    });

    return {
        data: data as Usuario[],
        total: total as number,
    };
}

export async function findUsuarioById(id: number) {
    const [result, fields] = await runQuery(async function (connection) {
        return connection.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    });

    return result[0] as Usuario | null;
}

export async function usuarioExiste(email: string, password: string) {
    const hash = createHash("sha256");
    hash.update(password);

    const [result, fields] = await runQuery(async function (connection) {
        return connection.query("SELECT * FROM usuarios WHERE email = ? AND password = ? LIMIT 1", [
            email,
            hash.digest("hex"),
        ]);
    });

    return result[0] as Usuario | null;
}
