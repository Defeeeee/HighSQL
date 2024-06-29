// @ts-ignore
import Connection from 'highsql';

const connection = new Connection('localhost', 'root', 'password', 'database');

const users = await connection.select('users');

console.log(users);