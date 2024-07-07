import { createPool, Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import {DatabaseError, QueryError} from './errors';

// Define the Connection class
export class Connection {
    private pool: Pool;

    // Constructor for the Connection class
    constructor(
        private host: string,
        private user: string,
        private password: string,
        private database: string,
        private connectionLimit: number = 10,
        private port: number = 3306,
    ) {
        // Create a new connection pool
        try {
            this.pool = createPool({
                host: this.host,
                user: this.user,
                password: this.password,
                database: this.database,
                connectionLimit: this.connectionLimit,
                port: this.port,
            });
        } catch (error) {
            // Log and throw the error if the connection pool fails to create
            if (error instanceof Error) {
                console.error(error.message);
                throw new DatabaseError(error.message);
            }
            else {
                console.error('An unknown error occurred.');
                throw new DatabaseError('An unknown error occurred.')
            }
        }
    }

    // Method to execute a query
    async query<T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader>(sql: string, values?: any[]): Promise<T> {
        const connection = await this.pool.getConnection();
        try {
            // Execute the query
            const [rows] = await connection.query(sql, values);
            return rows as T;
        } catch (error) {
            // Log and throw the error if the query fails
            if (error instanceof Error) {
                console.error(error.message);
                throw new QueryError(error.message);
            }
            else {
                console.error('An unknown error occurred.');
                throw new QueryError('An unknown error occurred.')
            }
        } finally {
            // Release the connection back to the pool
            connection.release();
        }
    }

    // Method to execute a SELECT query
    async select(table: string, columns: string = '*', where?: string, params?: any[]): Promise<RowDataPacket[]> {
        let sql = `SELECT ${columns} FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        return this.query<RowDataPacket[]>(sql, params);
    }

    // Method to execute an INSERT query
    async insert(table: string, values: any): Promise<ResultSetHeader> {
        const sql = `INSERT INTO ${table} SET ?`;
        return this.query<ResultSetHeader>(sql, values);
    }

    // Method to execute an UPDATE query
    async update(table: string, values: any, where: string, params?: any[]): Promise<ResultSetHeader> {
        const sql = `UPDATE ${table} SET ? WHERE ${where}`;
        return this.query<ResultSetHeader>(sql, [values, ...(params || [])]);
    }

    // Method to execute a DELETE query
    async delete(table: string, where: string, params?: any[]): Promise<ResultSetHeader> {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        return this.query<ResultSetHeader>(sql, params || []);
    }

    // Method to close the connection pool
    async close(): Promise<void> {
        try {
            await this.pool.end();
        } catch (error) {
            // Log and throw the error if the connection pool fails to close
            if (error instanceof Error) {
                console.error(error.message);
                throw new DatabaseError(error.message);
            }
            else {
                console.error('An unknown error occurred.');
                throw new DatabaseError('An unknown error occurred.')
            }
        }

    }

    // Method to get the connection pool
    getPool(): Pool {
        return this.pool;
    }
}