import { ValidationError } from 'class-validator/types/validation/ValidationError';

export interface ValidationResult {
    isValid: boolean;
    value: any;
    errors: any[] | ValidationError[];
}

export interface ParamMetadata {
    type: string;
    name?: string;
    dtoClass?: any;
    validationType?: string;
}
