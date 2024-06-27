# MySQL Connection Manager

[![npm version](https://img.shields.io/npm/v/highsql.svg)](https://www.npmjs.com/package/highsql)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A simple and secure Node.js module for managing MySQL database connections.

## Features

* **Promise-based:** Utilizes `mysql2/promise` for a modern asynchronous interface.
* **Prepared Statements:** Prioritizes security against SQL injection attacks.
* **Flexible Queries:** Allows executing arbitrary SQL statements (with caution).

## Installation

```bash
npm install highsql
```

## Usage

```javascript
import Connection from 'highsql';

async function main() {
    const conn = new Connection('your_host', 'your_user', 'your_password', 'your_database');
    await conn.connect();

    // Example: Select data
    const [rows, fields] = await conn.select('*', 'users', 'id = 1');

    // Example: Insert data (use prepared statements!)
    await conn.insert('users', '(name, email)', '("Alice", "email@highsql.com")');

    // Example: Update data
    await conn.update('users', 'email = "email@highsql.com"', 'id = 1');

    // Example: Delete data
    await conn.delete('users', 'id = 1');

    await conn.close();
}

main();
```

## Functions table

| Function | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `connect()` | Establishes a connection to the MySQL database. | None | None |
| `close()` | Closes the connection to the MySQL database. | None | None |
| `select()` | Executes a SELECT query. | `columns`, `table`, `where` | `[rows, fields]` |
| `insert()` | Executes an INSERT query. | `table`, `columns`, `values` | None |
| `update()` | Executes an UPDATE query. | `table`, `set`, `where` | None |
| `delete()` | Executes a DELETE query. | `table`, `where` | None |
| `query()` | Executes an arbitrary SQL statement. | `sql` | `[rows, fields]` |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
