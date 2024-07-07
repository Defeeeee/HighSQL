export class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
    }
}
export class QueryError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'QueryError';
    }
}
