import { createPool } from 'mysql2/promise';
class Connection {
    constructor(host, user, password, database, connectionLimit = 10) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.connectionLimit = connectionLimit;
        this.pool = createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectionLimit: this.connectionLimit
        });
    }
    async getConnection() {
        return this.pool.getConnection();
    }
    async query(sql, values) {
        const connection = await this.getConnection();
        try {
            const [result] = await connection.query(sql, values);
            return result;
        }
        catch (error) {
            console.error('Error executing query:', error); // Or use your preferred logging mechanism
            throw error; // Re-throw the error to handle it at a higher level
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
        return await this.query(sql, params);
    }
    async insert(table, values) {
        const sql = `INSERT INTO ${table} SET ?`;
        return await this.query(sql, values);
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
