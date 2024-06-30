import { createPool } from 'mysql2/promise';
class Connection {
    constructor(host, user, password, database, connectionLimit = 10, port = 3306) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.connectionLimit = connectionLimit;
        this.port = port;
        this.pool = createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectionLimit: this.connectionLimit,
            port: this.port,
        });
    }
    async query(sql, values) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(sql, values);
            return rows;
        }
        catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
        finally {
            connection.release();
        }
    }
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
}
export default Connection;
