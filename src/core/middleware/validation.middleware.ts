import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// exception
import { ValidationException } from '../common/exceptions/validation.exception';

// interface
import { ValidationResult, ParamMetadata } from '../common/interfaces/validation.interfaces';

/**
 * Creates a validation middleware for the specified parameter type
 * @param paramType The type of parameter to validate
 * @param paramConfig The configuration for the parameter validation
 * @returns A request handler that validates the specified parameter type
 */
export function createValidationMiddleware(
    paramType: 'body' | 'query' | 'param' | 'params',
    paramConfig: Record<string, ParamMetadata | any>
): RequestHandler {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const source = req[paramType];
            const updates: Record<string, any> = {};

            for (const [index, config] of Object.entries(paramConfig)) {
                if (!config) continue;

                if (config.type === 'param' && config.name) {
                    await handleParamValidation(req, config, updates);
                    continue;
                }

                if (config.type === 'params') {
                    await handleParamsValidation(req, config, paramType, updates, source);
                    continue;
                }

                await handleStandardValidation(req, paramType, paramConfig, index, updates, config);
            }

            if (Object.keys(updates).length > 0) {
                req[paramType] = { ...source, ...updates };
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Handles validation for single @Param() decorator
 * @param req The request object
 * @param config The configuration for the parameter validation
 * @param updates The updates object to store the validated parameter
 */
function handleParamValidation(
    req: Request,
    config: ParamMetadata,
    updates: Record<string, any>
): void {
    const paramName = config.name!;
    const paramValue = req.params[paramName];
    const validationResult = validatePrimitiveParam(
        paramName,
        paramValue,
        config.validationType || 'string'
    );

    if (!validationResult.isValid) {
        throw new ValidationException(
            `Parameter validation failed for '${paramName}'`,
            validationResult.errors
        );
    }

    updates[paramName] = validationResult.value;
}

/**
 * Handles validation for @Params() decorator
 * @param req The request object
 * @param config The configuration for the parameter validation
 * @param paramType The type of parameter to validate
 * @param updates The updates object to store the validated parameter
 * @param source The source object to validate
 */
async function handleParamsValidation(
    req: Request,
    config: ParamMetadata,
    paramType: string,
    updates: Record<string, any>,
    source: any
): Promise<void> {
    if (config.dtoClass) {
        const dto = plainToInstance(config.dtoClass, source);
        const errors = await validate(dto as object, {
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: req.method === 'PATCH',
        });

        if (errors.length > 0) {
            throw new ValidationException('Validation failed for @Params()', errors);
        }

        Object.assign(updates, dto);
    } else {
        const validatedParams: Record<string, any> = {};

        for (const [paramName, paramValue] of Object.entries(source || {})) {
            const validationResult = validatePrimitiveParam(paramName, paramValue, 'string');

            if (!validationResult.isValid) {
                throw new ValidationException(
                    `Parameter validation failed for '${paramName}' in @Params()`,
                    validationResult.errors
                );
            }

            validatedParams[paramName] = validationResult.value;
        }

        Object.assign(updates, validatedParams);
    }
}

/**
 * Handles standard DTO validation for @Body() and @Query() decorators
 * @param req The request object
 * @param paramType The type of parameter to validate
 * @param paramConfig The configuration for the parameter validation
 * @param index The index of the parameter
 * @param updates The updates object to store the validated parameter
 * @param config The configuration for the parameter validation
 */
async function handleStandardValidation(
    req: Request,
    paramType: string,
    paramConfig: Record<string, any>,
    index: string,
    updates: Record<string, any>,
    config: any
): Promise<void> {
    const source = req[paramType as keyof Request];
    let dataToValidate = source;

    if (paramType === 'query') {
        dataToValidate = convertQueryParams(source, config);
    }

    const dto = plainToInstance(config, dataToValidate);
    const errors = await validate(dto as object, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: req.method === 'PATCH',
    });

    if (errors.length > 0) {
        throw new ValidationException(`Validation failed for ${paramType}`, errors);
    }

    if (paramType === 'params' && paramConfig[index]?.name) {
        updates[paramConfig[index].name] = dto[paramConfig[index].name];
    } else {
        Object.assign(updates, dto);
    }
}

/**
 * Converts query parameters to a DTO object
 * @param source The source object containing the query parameters
 * @param dtoClass The DTO class to convert to
 * @returns The converted DTO object
 */
function convertQueryParams(source: any, dtoClass: any): any {
    if (!source || typeof source !== 'object' || !dtoClass) {
        return source;
    }

    const result = { ...source };
    const metadataStorage = (global as any).classValidatorMetadataStorage;
    if (!metadataStorage) return result;

    const targetMetadata = metadataStorage.getTargetValidationMetadatas(
        dtoClass,
        undefined,
        false,
        false
    );

    if (!Array.isArray(targetMetadata)) return result;

    const propertyValidations = new Map<string, any[]>();
    for (const meta of targetMetadata) {
        if (!meta.propertyName) continue;
        const validations = propertyValidations.get(meta.propertyName) || [];
        validations.push(meta);
        propertyValidations.set(meta.propertyName, validations);
    }

    for (const [propertyName, validations] of propertyValidations.entries()) {
        if (source[propertyName] == null) continue;

        const value = source[propertyName];
        try {
            const isNumberField = validations.some(v =>
                ['isNumber', 'min', 'max', 'isInt', 'isFloat'].includes(v.type || v.name)
            );

            const isBooleanField = validations.some(
                v =>
                    v.type === 'isBoolean' ||
                    v.name === 'isBoolean' ||
                    v.type === 'isBooleanString' ||
                    v.name === 'isBooleanString'
            );

            if (isNumberField && typeof value === 'string') {
                const num = parseFloat(value);
                if (!isNaN(num) && isFinite(value as any)) {
                    result[propertyName] = num;
                }
            } else if (isBooleanField) {
                if (value === 'true' || value === true || value === '1' || value === 1) {
                    result[propertyName] = true;
                } else if (value === 'false' || value === false || value === '0' || value === 0) {
                    result[propertyName] = false;
                }
            }
        } catch (error) {
            console.error(`Failed to convert ${propertyName}:`, error);
        }
    }

    return result;
}

/**
 * Validates a primitive parameter based on its type
 * @param name The name of the parameter
 * @param value The value of the parameter
 * @param type The type of the parameter
 * @returns An object containing the validation result
 */
function validatePrimitiveParam(name: string, value: any, type: string): ValidationResult {
    if (value === undefined || value === null) {
        return {
            isValid: false,
            value: null,
            errors: [
                {
                    property: name,
                    value,
                    constraints: { required: `${name} is required` },
                },
            ],
        };
    }

    switch (type) {
        case 'string':
            if (typeof value !== 'string') {
                return {
                    isValid: false,
                    value: null,
                    errors: [
                        {
                            property: name,
                            value,
                            constraints: { type: `${name} must be a string` },
                        },
                    ],
                };
            }

            const trimmedValue = value.trim();
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (name.toLowerCase().includes('uuid') && !uuidRegex.test(trimmedValue)) {
                return {
                    isValid: false,
                    value: null,
                    errors: [
                        {
                            property: name,
                            value,
                            constraints: { uuid: `${name} must be a valid UUID` },
                        },
                    ],
                };
            }

            return { isValid: true, value: trimmedValue, errors: [] };

        case 'number':
            const numValue = Number(value);
            if (isNaN(numValue)) {
                return {
                    isValid: false,
                    value: null,
                    errors: [
                        {
                            property: name,
                            value,
                            constraints: { type: `${name} must be a number` },
                        },
                    ],
                };
            }
            return { isValid: true, value: numValue, errors: [] };

        case 'boolean':
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'true')
                    return { isValid: true, value: true, errors: [] };
                if (value.toLowerCase() === 'false')
                    return { isValid: true, value: false, errors: [] };
            }

            if (typeof value === 'boolean') {
                return { isValid: true, value, errors: [] };
            }

            return {
                isValid: false,
                value: null,
                errors: [
                    {
                        property: name,
                        value,
                        constraints: { type: `${name} must be a boolean` },
                    },
                ],
            };

        default:
            return { isValid: true, value, errors: [] };
    }
}
