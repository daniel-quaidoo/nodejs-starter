import { HttpException } from './http.exception';
import { ValidationError as ClassValidatorError } from 'class-validator';

/**
 * Exception thrown when validation fails
 * @extends HttpException
 */
export class ValidationException extends HttpException {
    public readonly error: Record<string, string[]>;

    constructor(message: string, validationErrors: ClassValidatorError[]) {
        super(400, 'Validation Error', message);
        this.error = this.formatErrors(validationErrors);
    }

    private formatErrors(errors: ClassValidatorError[]): Record<string, string[]> {
        const formatted: Record<string, string[]> = {};

        errors.forEach(error => {
            if (error.constraints) {
                formatted[error.property] = Object.values(error.constraints);
            }

            if (error.children && error.children.length > 0) {
                const childErrors = this.formatErrors(error.children);
                Object.assign(formatted, childErrors);
            }
        });

        return formatted;
    }
}
