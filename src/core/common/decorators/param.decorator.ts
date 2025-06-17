import 'reflect-metadata';

// constant
import {
    BODY_METADATA_KEY,
    PARAM_METADATA_KEY,
    PARAMS_METADATA_KEY,
    QUERY_METADATA_KEY,
    DESIGN_PARAMTYPES_KEY,
} from '../di/di-token.constant';

/**
 * Returns the validatable class for the specified type
 * @param type The type to validate
 * @returns The validatable class for the specified type
 */
function getValidatableClass(type: any): any | null {
    if (!type || typeof type !== 'function') return null;

    const primitiveTypes = [String, Number, Boolean];
    if (primitiveTypes.includes(type)) {
        return type;
    }

    // Exclude these complex built-ins
    const excludedTypes = [Object, Array, Date, Function];
    if (excludedTypes.includes(type)) return null;

    // Check if it has TypeScript design-time metadata (indicates it's a proper class)
    if (type.prototype && Reflect.hasMetadata && Reflect.hasMetadata(DESIGN_PARAMTYPES_KEY, type)) {
        return type;
    }

    // Check for methods on prototype
    if (type.prototype && Object.getOwnPropertyNames(type.prototype).length > 1) {
        return type;
    }

    // Check if it has class-validator decorators
    if (type.prototype && Reflect.getMetadataKeys) {
        const hasValidationMetadata = Reflect.getMetadataKeys(type.prototype).some(
            key => typeof key === 'string' && key.startsWith('class-validator')
        );

        if (hasValidationMetadata) {
            return type;
        }
    }

    // Check if it's a custom class (not a built-in constructor)
    if (
        type.name &&
        type.name !== 'Object' &&
        type.name !== 'Function' &&
        type.prototype &&
        type.prototype.constructor === type
    ) {
        return type;
    }

    return null;
}

/**
 * Resolves the DTO class for the specified type
 * @param explicitDto The explicit DTO to use
 * @param inferredType The inferred type to use
 * @returns The resolved DTO class
 */
function resolveDtoClass(explicitDto?: any, inferredType?: any): any | null {
    if (explicitDto) {
        const validExplicit = getValidatableClass(explicitDto);
        if (validExplicit) {
            return validExplicit;
        }
    }

    if (inferredType) {
        const validInferred = getValidatableClass(inferredType);
        if (validInferred) {
            return validInferred;
        }
    }

    return null;
}

/**
 * Decorator to define a body parameter
 * @param dto The DTO to use for validation
 * @returns The body parameter decorator
 */
export function Body(dto?: any): any {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
        const parameters: { [key: number]: any } =
            Reflect.getOwnMetadata(BODY_METADATA_KEY, target, propertyKey) || {};

        // get the parameter types
        const paramTypes = Reflect.getMetadata(DESIGN_PARAMTYPES_KEY, target, propertyKey) || [];
        const paramType = paramTypes[parameterIndex];

        const dtoClass = resolveDtoClass(dto, paramType);
        parameters[parameterIndex] = dtoClass;

        Reflect.defineMetadata(BODY_METADATA_KEY, parameters, target, propertyKey);
    };
}

/**
 * Decorator to define a query parameter
 * @returns The query parameter decorator
 */
export function Query(): any {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
        const parameters: { [key: number]: any } =
            Reflect.getOwnMetadata(QUERY_METADATA_KEY, target, propertyKey) || {};

        // get the parameter types
        const paramTypes = Reflect.getMetadata(DESIGN_PARAMTYPES_KEY, target, propertyKey) || [];
        const paramType = paramTypes[parameterIndex];
        const dtoClass = resolveDtoClass(paramType);

        parameters[parameterIndex] = dtoClass;
        Reflect.defineMetadata(QUERY_METADATA_KEY, parameters, target, propertyKey);
    };
}

/**
 * Decorator to define a param parameter
 * @param name The name of the param
 * @returns The param parameter decorator
 */
export function Param(name: string): any {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
        const parameters: { [key: number]: any } =
            Reflect.getOwnMetadata(PARAM_METADATA_KEY, target, propertyKey) || {};

        // get the parameter types from TypeScript metadata
        const paramTypes = Reflect.getMetadata(DESIGN_PARAMTYPES_KEY, target, propertyKey) || [];
        const paramType = paramTypes[parameterIndex];

        // map TypeScript types to validation types
        let validationType: any;
        if (paramType === String) {
            validationType = 'string';
        } else if (paramType === Number) {
            validationType = 'number';
        } else if (paramType === Boolean) {
            validationType = 'boolean';
        } else {
            validationType = 'string';
        }

        parameters[parameterIndex] = {
            name,
            type: 'param',
            validationType,
            paramType,
        };

        Reflect.defineMetadata(PARAM_METADATA_KEY, parameters, target, propertyKey);
    };
}

/**
 * Decorator to define a params parameter
 * @param dto The DTO to use for validation
 * @returns The params parameter decorator
 */
export function Params(dto?: any): any {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
        const parameters: { [key: number]: any } =
            Reflect.getOwnMetadata(PARAMS_METADATA_KEY, target, propertyKey) || {};

        // get the parameter types
        const paramTypes = Reflect.getMetadata(DESIGN_PARAMTYPES_KEY, target, propertyKey) || [];
        const paramType = paramTypes[parameterIndex];

        // use the provided DTO or the parameter type
        const dtoClass = resolveDtoClass(dto, paramType);

        // store params metadata
        parameters[parameterIndex] = {
            type: 'params',
            dtoClass,
            paramType,
        };

        Reflect.defineMetadata(PARAMS_METADATA_KEY, parameters, target, propertyKey);
    };
}
