import { createPool } from 'mysql2/promise';
import { DatabaseError, QueryError } from './errors';
// Define the Connection class
export class Connection {
    // Constructor for the Connection class
    constructor(host, user, password, database, connectionLimit = 10, port = 3306) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.connectionLimit = connectionLimit;
        this.port = port;
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
        }
        catch (error) {
            // Log and throw the error if the connection pool fails to create
            if (error instanceof Error) {
                console.error(error.message);
                throw new DatabaseError(error.message);
            }
            else {
                console.error('An unknown error occurred.');
                throw new DatabaseError('An unknown error occurred.');
            }
        }
    }
    // Method to execute a query
    async query(sql, values) {
        const connection = await this.pool.getConnection();
        try {
            // Execute the query
            const [rows] = await connection.query(sql, values);
            return rows;
        }
        catch (error) {
            // Log and throw the error if the query fails
            if (error instanceof Error) {
                console.error(error.message);
                throw new QueryError(error.message);
            }
            else {
                console.error('An unknown error occurred.');
                throw new QueryError('An unknown error occurred.');
            }
        }
        finally {
            // Release the connection back to the pool
            connection.release();
        }
    }
    // Method to execute a SELECT query
    async select(table, columns = '*', where, params) {
        let sql = `SELECT ${columns} FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        return this.query(sql, params);
    }
    // Method to execute an INSERT query
    async insert(table, values) {
        const sql = `INSERT INTO ${table} SET ?`;
        return this.query(sql, values);
    }
    // Method to execute an UPDATE query
    async update(table, values, where, params) {
        const sql = `UPDATE ${table} SET ? WHERE ${where}`;
        return this.query(sql, [values, ...(params || [])]);
    }
    // Method to execute a DELETE query
    async delete(table, where, params) {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        return this.query(sql, params || []);
    }
    // Method to close the connection pool
    async close() {
        try {
            await this.pool.end();
        }
        catch (error) {
            // Log and throw the error if the connection pool fails to close
            if (error instanceof Error) {
                console.error(error.message);
                throw new DatabaseError(error.message);
            }
            else {
                console.error('An unknown error occurred.');
                throw new DatabaseError('An unknown error occurred.');
            }
        }
    }
    // Method to get the connection pool
    getPool() {
        return this.pool;
    }
}
