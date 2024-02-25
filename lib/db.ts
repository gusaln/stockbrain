import mysql from 'mysql'

/**
* connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
*     if (error) throw error;
*     console.log('The solution is: ', results[0].solution);
* });
*/
export const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'stockbrain',
    password: process.env.DB_PASSWORD || 'secret',
    database: 'stockbrain',
});