import mysql from "mysql2/promise";

const pool = mysql.createPool({
    connectionLimit: 40,
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USERNAME || "stockbrain",
    password: process.env.DB_PASSWORD || "secret",
    database: "stockbrain",
});

export async function runQuery<T = void>(cb: (c: mysql.PoolConnection) => Promise<T>): Promise<T> {
    let connection: mysql.PoolConnection;

    try {
        connection = await pool.getConnection();
    } catch (error) {
        throw error;
    }

    try {
        await connection.beginTransaction();
        const res = await cb(connection);
        await connection.commit();
        return res;
    } finally {
        try {
            await connection.rollback();
        } finally {
            connection.release();
        }
    }
}
