import { createConnection } from 'mysql2/promise';
export class Connection {
    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }
    async connect() {
        this.conn = await createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });
    }
    async select(columns, table, where) {
        if (!where) {
            return await this.conn.query('SELECT ? FROM ?', [columns, table]);
        }
        return await this.conn.query('SELECT ? FROM ? WHERE ?', [columns, table, where]);
    }
    async insert(table, values) {
        return await this.conn.query('INSERT INTO ? VALUES ?', [table, values]);
    }
    async update(table, values, where) {
        return await this.conn.query('UPDATE ? SET ? WHERE ?', [table, values, where]);
    }
    async delete(table, where) {
        return await this.conn.query('DELETE FROM ? WHERE ?', [table, where]);
    }
    async close() {
        await this.conn.end();
    }
    async query(sql) {
        return await this.conn.query(sql);
    }
}
export default Connection;
