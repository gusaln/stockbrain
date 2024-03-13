import { createHash } from "crypto";
import { runQuery } from "../db";

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
