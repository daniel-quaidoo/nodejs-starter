import { NextFunction, Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';

/**
 * Validates a DTO (Data Transfer Object)
 * @param dtoClass The DTO class to validate
 * @returns A middleware function that validates the DTO
 */
type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const dto = plainToClass(dtoClass, req.query);
        const errors: ValidationError[] = await validate(dto as object);

        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }

        req.query = dto as any;
        next();
    };
}
