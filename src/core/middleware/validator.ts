import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

/**
 * Validates a DTO (Data Transfer Object)
 * @param dtoClass The DTO class to validate
 * @returns A middleware function that validates the DTO
 */
export async function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToClass(dtoClass, req.query);
        const errors = await validate(dto as any);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        req.query = dto as any;
        next();
    };
}