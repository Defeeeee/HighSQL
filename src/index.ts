import { createPool, Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

class Connection {
    private pool: Pool;

    constructor(
        private host: string,
        private user: string,
        private password: string,
        private database: string,
        private connectionLimit: number = 10,
        private port: number = 3306,
    ) {
        this.pool = createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectionLimit: this.connectionLimit,
            port: this.port,
        });
    }

    async query<T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader>(sql: string, values?: any[]): Promise<T> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(sql, values);
            return rows as T;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async select(table: string, columns: string = '*', where?: string, params?: any[]): Promise<RowDataPacket[]> {
        let sql = `SELECT ${columns} FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        return this.query<RowDataPacket[]>(sql, params);
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
}

export default Connection;
