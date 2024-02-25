import mysql from 'mysql2/promise'

export function createConnection() {
     return mysql.createConnection({
        connectionLimit: 10,
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USERNAME || 'stockbrain',
        password: process.env.DB_PASSWORD || 'secret',
        database: 'stockbrain',
    });
}