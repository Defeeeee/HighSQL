# MySQL Connection Manager

[![npm version](https://img.shields.io/npm/v/highsql.svg)](https://www.npmjs.com/package/highsql)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A simple and secure Node.js module for managing MySQL database connections.

## Features

* **Promise-based:** Utilizes `mysql2/promise` for a modern asynchronous interface.
* **Connection Pooling:** Efficiently manages multiple connections for optimal performance.
* **Prepared Statements:** Prioritizes security against SQL injection attacks.
* **Flexible Queries:** Allows executing arbitrary SQL statements (with caution).

## Installation

```bash
npm install highsql
```

## Usage

```js
import Connection from 'highsql';

async function main() {
const conn = new Connection('your_host', 'your_user', 'your_password', 'your_database');

    // Example: Select data
    const rows = await conn.select('users', 'id, name', 'id = ?', [1]);

    // Example: Insert data (use prepared statements!)
    await conn.insert('users', { name: 'Alice', email: 'alice@example.com' });

    // Example: Update data
    await conn.update('users', { email: 'alice@highsql.com' }, 'id = ?', [1]);

    // Example: Delete data
    await conn.delete('users', 'id = ?', [1]);
}

main();
```


## Functions

| Function | Description | Parameters | Returns |
|---|---|---|---|
| `select(table, columns, where?, params?)` | Executes a SELECT query. | `table`, `columns`, optional `where` condition, optional array of `params` for prepared statements | `Promise<RowDataPacket[]>` |
| `insert(table, values)` | Executes an INSERT query. | `table`, an object of `values` to insert | `Promise<ResultSetHeader>` |
| `update(table, values, where, params?)` | Executes an UPDATE query. | `table`, an object of `values` to update, `where` condition, optional array of `params` | `Promise<ResultSetHeader>` |
| `delete(table, where, params?)` | Executes a DELETE query. | `table`, `where` condition, optional array of `params` | `Promise<ResultSetHeader>` |
| `query(sql, values?)` | Executes an arbitrary SQL statement (use with caution!). | `sql` statement, optional array of `values` for prepared statements | `Promise<ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | any>` |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.