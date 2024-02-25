import mysql from 'mysql'

/**
* connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
*     if (error) throw error;
*     console.log('The solution is: ', results[0].solution);
* });
*/
export const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST || '127.0.0.1',
    user: process.env.DATABASE_USER || 'stockbrain',
    password: process.env.DATABASE_SECRET || 'secret',
    database: process.env.DATABASE_NAME || 'stockbrain',
});