# MySQL Database Connection

A TypeScript module for handling MySQL database connections and performing queries.

## Features

- **Promise-based:** Utilizes `mysql2/promise` for a modern asynchronous interface.
- **Connection Pooling:** Efficiently manages multiple connections for optimal performance.
- **Prepared Statements:** Prioritizes security against SQL injection attacks.
- **Flexible Queries:** Allows executing arbitrary SQL statements.
- **Convenience Methods:** Provides methods for common operations like `select`, `insert`, `update`, and `delete`.
- **Transactions:** Supports executing multiple queries in a transaction.
- **Error Handling:** Includes robust error handling for queries and connection management.

## Installation

```bash
npm install mysql2
```

## Usage

```js
import { Connection, ConnectionConfig } from 'mysql-connection'; // Replace with the actual path to your module

async function main() {
const config: ConnectionConfig = {
host: 'your_host',
user: 'your_user',
password: 'your_password',
database: 'your_database'
};

    const conn = new Connection(config);

    // Example: Select data
    const rows = await conn.select('users', 'id, name', 'id = ?', [1]);
    console.log(rows);

    // Example: Insert data
    const result = await conn.insert('users', { name: 'Bob', email: 'bob@example.com' });
    console.log(result);

    // Example: Update data
    await conn.update('users', { email: 'bob@newmail.com' }, 'id = ?', [1]);

    // Example: Delete data
    await conn.delete('users', 'id = ?', [1]);

    // Example: Transaction
    await conn.transaction(async (connection) => {
        await connection.insert('users', { name: 'Charlie', email: 'charlie@example.com' });
        await connection.update('users', { email: 'charlie@newmail.com' }, 'id = ?', [2]); // Assuming Charlie has ID 2
    });

    await conn.close(); // Close the connection pool when done
}

main().catch(error => {
console.error('Error:', error);
});
```


## API

### Connection(config: ConnectionConfig)

Creates a new `Connection` object.

- `config`: A configuration object of type `ConnectionConfig` containing database connection details.

### Methods

- `query<T>(sql: string, values?: any[]): Promise<T>`: Executes a SQL query with optional values.
- `select(table: string, columns?: string, where?: string, params?: any[]): Promise<RowDataPacket[]>`: Executes a `SELECT` query.
- `insert(table: string, values: any): Promise<ResultSetHeader>`: Executes an `INSERT` query.
- `update(table: string, values: any, where: string, params?: any[]): Promise<ResultSetHeader>`: Executes an `UPDATE` query.
- `delete(table: string, where: string, params?: any[]): Promise<ResultSetHeader>`: Executes a `DELETE` query.
- `get(table: string, where: string, params?: any[]): Promise<RowDataPacket | null>`: Retrieves a single row based on a condition.
- `getByID(table: string, id: number): Promise<RowDataPacket | null>`: Retrieves a single row by its ID.
- `count(table: string, where?: string, params?: any[]): Promise<number>`: Counts rows based on a condition.
- `exists(table: string, where: string, params?: any[]): Promise<boolean>`: Checks if any rows match a condition.
- `transaction(queries: (connection: Connection) => Promise<any>): Promise<any>`: Executes multiple queries in a transaction.
- `close(): Promise<void>`: Closes the connection pool.
- `getPool(): Pool`: Returns the underlying connection pool.


## Error Handling

The module includes error handling for both query errors and connection pool errors. Errors are logged to the console with detailed information, including the error message, query, and values (if applicable). Custom error classes `QueryError` and `DatabaseError` are thrown to help differentiate between the types of errors.

## License

MIT License
