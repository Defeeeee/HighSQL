/**
 * Project Name: MySQL Database Connection
 * Author: Defeeeee
 *
 * This TypeScript module provides a class `Connection` that encapsulates the functionality of a MySQL database connection.
 * It uses the `mysql2/promise` library to create a connection pool and provides methods for common SQL operations.
 * It also includes error handling for queries and pool operations.
 *
 * The `Connection` class requires a configuration object of type `ConnectionConfig` to establish a connection to the database.
 *
 * The `Connection` class provides the following methods:
 * - `query`: Executes a SQL query with optional values and returns the result.
 * - `select`, `insert`, `update`, `delete`: Convenience methods for common SQL operations.
 * - `get`, `getByID`: Methods to retrieve a single row from a table.
 * - `count`, `exists`: Methods to count rows and check existence of rows in a table.
 * - `transaction`: Executes multiple queries in a transaction.
 * - `close`: Closes the connection pool.
 * - `getPool`: Returns the connection pool.
 */
import { createPool } from 'mysql2/promise';
import { DatabaseError, QueryError } from './errors';
export class Connection {
    // Constructor takes a configuration object and creates a connection pool
    constructor(config) {
        var _a, _b;
        this.pool = createPool(Object.assign(Object.assign({}, config), { connectionLimit: (_a = config.connectionLimit) !== null && _a !== void 0 ? _a : 10, port: (_b = config.port) !== null && _b !== void 0 ? _b : 3306 }));
    }
    // Generic query method with improved error logging
    async query(sql, values) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await this.pool.query(sql, values);
            return rows;
        }
        catch (error) {
            // Log and throw a QueryError on error
            if (error instanceof Error) {
                console.error('Query error:', error.message);
                console.error('Query:', sql);
                if (values)
                    console.error('Values:', values);
                throw new QueryError(error.message);
            }
            else {
                console.error('An unknown query error occurred.');
                throw new QueryError('An unknown query error occurred.');
            }
        }
        finally {
            connection.release(); // Always release the connection
        }
    }
    // Convenience methods for common operations
    async select(table, columns = '*', where, params) {
        let sql = `SELECT ${columns} FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        return this.query(sql, params);
    }
    async insert(table, values) {
        const sql = `INSERT INTO ${table} SET ?`;
        return this.query(sql, values);
    }
    async update(table, values, where, params) {
        const sql = `UPDATE ${table} SET ? WHERE ${where}`;
        return this.query(sql, [values, ...(params || [])]);
    }
    async delete(table, where, params) {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        return this.query(sql, params || []);
    }
    async get(table, where, params) {
        const rows = await this.select(table, '*', where, params);
        return rows.length > 0 ? rows[0] : null;
    }
    async getByID(table, id) {
        return this.get(table, 'id = ?', [id]);
    }
    async count(table, where, params) {
        const rows = await this.select(table, 'COUNT(*) as count', where, params);
        return rows[0].count;
    }
    async exists(table, where, params) {
        return (await this.count(table, where, params)) > 0;
    }
    async transaction(queries) {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();
        try {
            const result = await queries(this); // Assuming your queries access methods from `this`
            await connection.commit();
            return result;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    // Close the connection pool (with improved error handling)
    async close() {
        try {
            await this.pool.end();
        }
        catch (error) {
            // Log and throw a DatabaseError on error
            if (error instanceof Error) {
                console.error('Pool closing error:', error.message);
                throw new DatabaseError(error.message);
            }
            else {
                console.error('An unknown pool closing error occurred.');
                throw new DatabaseError('An unknown pool closing error occurred.');
            }
        }
    }
    // Access the pool directly (if needed)
    getPool() {
        return this.pool;
    }
}
