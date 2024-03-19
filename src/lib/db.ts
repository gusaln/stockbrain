import mysql from "mysql2/promise";

const config = {
    connectionLimit: 40,
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USERNAME || "stockbrain",
    password: process.env.DB_PASSWORD || "secret",
    database: "stockbrain",
};

const pool = mysql.createPool(config);

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
        } catch (error) {}
        pool.releaseConnection(connection);
    }
}

// export async function runQuery<T = void>(cb: (c: mysql.Connection) => Promise<T>): Promise<T> {
//     let connection: mysql.Connection;

//     try {
//         connection = await mysql.createConnection(config);
//     } catch (error) {
//         throw error;
//     }

//     try {
//         await connection.beginTransaction();
//         const res = await cb(connection);
//         await connection.commit();
//         return res;
//     } finally {
//         try {
//             await connection.rollback();
//         } catch (error) {
//             //
//         }
//         connection.destroy();
//     }
// }
