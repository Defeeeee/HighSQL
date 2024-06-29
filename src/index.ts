import {createPool, Pool, PoolConnection, RowDataPacket, ResultSetHeader} from 'mysql2/promise';

class Connection {
    private pool: Pool;

    constructor(
        private host: string,
        private user: string,
        private password: string,
        private database: string,
        private connectionLimit: number = 10
    ) {
        this.pool = createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectionLimit: this.connectionLimit
        });
    }

    private async getConnection(): Promise<PoolConnection> {
        return this.pool.getConnection();
    }

    private async query(sql: string, values?: any[]): Promise<ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | any> {
        const connection = await this.getConnection();
        try {
            const [result] = await connection.query(sql, values);
            return result;
        } catch (error) {
            console.error('Error executing query:', error); // Or use your preferred logging mechanism
            throw error; // Re-throw the error to handle it at a higher level
        } finally {
            connection.release();
        }
    }

    async select(table: string, columns: string = '*', where?: string, params?: any[]): Promise<RowDataPacket[]> {
        let sql = `SELECT ${columns} FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        return await this.query(sql, params) as Promise<RowDataPacket[]>;
    }

    async insert(table: string, values: any): Promise<ResultSetHeader> {
        const sql = `INSERT INTO ${table} SET ?`;
        return await this.query(sql, values) as Promise<ResultSetHeader>;
    }

    async update(table: string, values: any, where: string, params?: any[]): Promise<ResultSetHeader> {
        const sql = `UPDATE ${table} SET ? WHERE ${where}`;
        return this.query(sql, [values, ...(params || [])]) as Promise<ResultSetHeader>;
    }

    async delete(table: string, where: string, params?: any[]): Promise<ResultSetHeader> {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        return this.query(sql, params || []) as Promise<ResultSetHeader>;
    }
}

export default Connection;
