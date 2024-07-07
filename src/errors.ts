export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class QueryError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = 'QueryError';
    }
}