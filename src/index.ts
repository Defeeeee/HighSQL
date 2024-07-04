import { createPool, Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

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
        this.pool = createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectionLimit: this.connectionLimit,
            port: this.port,
        });
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
            console.error('Error executing query:', error);
            throw error;
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
        await this.pool.end();
    }
}