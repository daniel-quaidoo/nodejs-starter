import HttpStatus from 'http-status-codes';
import { HttpException } from './http.exception';

type DatabaseError = Error & {
    code?: string;
    detail?: string;
    driverError?: {
        detail?: string;
    };
    message: string;
    name: string;
    constraint?: string;
};

export class DuplicateEntryException extends HttpException {
    public readonly field: string;

    constructor(field: string, message?: string) {
        const errorMessage = message || `A record with this ${field} already exists.`;
        super(HttpStatus.CONFLICT, errorMessage, {
            error: 'Conflict',
            field,
        });
        Object.setPrototypeOf(this, DuplicateEntryException.prototype);
        this.name = 'DuplicateEntryException';
        this.field = field;
    }

    /**
     * Factory method to create a DuplicateEntryException from a database error
     * @param error The database error object
     * @returns A new instance of DuplicateEntryException
     */
    static fromError(error: DatabaseError): DuplicateEntryException {
        // Handle PostgreSQL error
        if (error.name === 'QueryFailedError' && error.code === '23505') {
            const detail = error.detail || '';
            const fieldMatch = detail.match(/Key \(([^)]+)\)=/);
            const field = fieldMatch ? fieldMatch[1] : 'field';
            return new DuplicateEntryException(
                field,
                `A record with this ${field} already exists.`
            );
        }

        // Handle MySQL/MariaDB error
        if (error.code === 'ER_DUP_ENTRY') {
            const fieldMatch = error.message.match(/for key '(.+?)'/);
            const field = fieldMatch ? fieldMatch[1] : 'field';
            return new DuplicateEntryException(
                field,
                `A record with this ${field} already exists.`
            );
        }

        // Default case
        return new DuplicateEntryException('field', 'Duplicate entry found.');
    }
}
