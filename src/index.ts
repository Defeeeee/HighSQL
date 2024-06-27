import {createConnection} from 'mysql2/promise';

export class Connection {
    private host: string;
    private user: string;
    private password: string;
    private database: string;
    private conn: any;

    constructor(host: string, user: string, password: string, database: string) {
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

    async select(columns: string, table: string, where?: string) {
        if (!where) {
            return await this.conn.query('SELECT ? FROM ?', [columns, table]);
        }
        return await this.conn.query('SELECT ? FROM ? WHERE ?', [columns, table, where]);
    }

    async insert(table: string, values: string) {
        return await this.conn.query('INSERT INTO ? VALUES ?', [table, values]);
    }

    async update(table: string, values: string, where: string) {
        return await this.conn.query('UPDATE ? SET ? WHERE ?', [table, values, where]);
    }

    async delete(table: string, where: string) {
        return await this.conn.query('DELETE FROM ? WHERE ?', [table, where]);
    }

    async close() {
        await this.conn.end();
    }

    async query(sql: string) {
        return await this.conn.query(sql);
    }
}

export default Connection;