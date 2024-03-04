import { createHash } from "crypto";
import { runQuery } from "../db";

const ROL = {
    administrador: 1,
    almacenero: 2,
    tecnico: 3,
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
        return connection.query(
            "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ? ,?)",
            [nombre, email, hash.digest("hex"), rol],
        );
    })

    return;
}
