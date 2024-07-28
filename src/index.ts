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

import {createPool, Pool, RowDataPacket, ResultSetHeader} from 'mysql2/promise';
import {DatabaseError, QueryError} from './errors.js';

// Interface to define connection configuration
export interface ConnectionConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit?: number;
    port?: number;
}

export class Connection {
    private pool: Pool;

    // Constructor takes a configuration object and creates a connection pool
    constructor(config: ConnectionConfig) {
        this.pool = createPool({
            ...config,
            connectionLimit: config.connectionLimit ?? 10, // Default connection limit is 10
            port: config.port ?? 3306, // Default port is 3306
        });
    }

    // Generic query method with improved error logging
    async query<T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader>(
        sql: string,
        values?: any[]
    ): Promise<T> {
        const connection = await this.pool.getConnection()
        try {
            const [rows] = await this.pool.query(sql, values);
            return rows as T;
        } catch (error) {
            // Log and throw a QueryError on error
            if (error instanceof Error) {
                console.error('Query error:', error.message);
                console.error('Query:', sql);
                if (values) console.error('Values:', values);
                throw new QueryError(error.message);
            } else {
                console.error('An unknown query error occurred.');
                throw new QueryError('An unknown query error occurred.');
            }
        } finally {
            connection.release(); // Always release the connection
        }
    }

    // Convenience methods for common operations
    async select(table: string, columns: string = '*', where?: string, params?: any[]): Promise<RowDataPacket> {
        let sql = `SELECT ${columns} FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        const [res, _] = await this.query<RowDataPacket[]>(sql, params || []);
        return res;
    }

    async insert(table: string, values: any): Promise<ResultSetHeader> {
        const sql = `INSERT INTO ${table} SET ?`;
        return this.query<ResultSetHeader>(sql, values);
    }

    async update(table: string, values: any, where: string, params?: any[]): Promise<ResultSetHeader> {
        const sql = `UPDATE ${table} SET ? WHERE ${where}`;
        return this.query<ResultSetHeader>(sql, [values, ...(params || [])]);
    }

    async delete(table: string, where: string, params?: any[]): Promise<ResultSetHeader> {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        return this.query<ResultSetHeader>(sql, params || []);
    }

    async get(table: string, where: string, params?: any[]): Promise<RowDataPacket | null> {
        const rows = await this.select(table, '*', where, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async getByID(table: string, id: number): Promise<RowDataPacket | null> {
        return this.get(table, 'id = ?', [id]);
    }

    async count(table: string, where?: string, params?: any[]): Promise<number> {
        const rows = await this.select(table, 'COUNT(*) as count', where, params);
        return rows[0].count;
    }

    async exists(table: string, where: string, params?: any[]): Promise<boolean> {
        return (await this.count(table, where, params)) > 0;
    }

    async transaction(queries: (connection: Connection) => Promise<any>): Promise<any> {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();

        try {
            const result = await queries(this); // Assuming your queries access methods from `this`
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Close the connection pool (with improved error handling)
    async close(): Promise<void> {
        try {
            await this.pool.end();
        } catch (error) {
            // Log and throw a DatabaseError on error
            if (error instanceof Error) {
                console.error('Pool closing error:', error.message);
                throw new DatabaseError(error.message);
            } else {
                console.error('An unknown pool closing error occurred.');
                throw new DatabaseError('An unknown pool closing error occurred.');
            }
        }
    }

    async getPool(): Promise<Pool> {
        try {
            return this.pool;
        } catch (error) {
            // Log and throw a DatabaseError on error
            if (error instanceof Error) {
                console.error('Pool retrieval error:', error.message);
                throw new DatabaseError(error.message);
            } else {
                console.error('An unknown pool retrieval error occurred.');
                throw new DatabaseError('An unknown pool retrieval error occurred.');
            }
        }
    }

    async getPoolConnection(): Promise<any> {
        try {
            return this.pool.getConnection();
        } catch (error) {
            // Log and throw a DatabaseError on error
            if (error instanceof Error) {
                console.error('Pool connection retrieval error:', error.message);
                throw new DatabaseError(error.message);
            } else {
                console.error('An unknown pool connection retrieval error occurred.');
                throw new DatabaseError('An unknown pool connection retrieval error occurred.');
            }
        }
    }

    async releasePoolConnection(connection: any): Promise<void> {
        try {
            connection.release();
        } catch (error) {
            // Log and throw a DatabaseError on error
            if (error instanceof Error) {
                console.error('Pool connection release error:', error.message);
                throw new DatabaseError(error.message);
            } else {
                console.error('An unknown pool connection release error occurred.');
                throw new DatabaseError('An unknown pool connection release error occurred.');
            }
        }
    }

    async escape(value: any): Promise<string> {
        return this.pool.escape(value);
    }
}

export default Connection;