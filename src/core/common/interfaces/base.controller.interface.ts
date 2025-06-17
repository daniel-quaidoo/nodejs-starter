import { Request, Response, NextFunction } from 'express';

// model
import { BaseModel } from '../entities/base.entity';

/**
 * Base controller interface
 * @template T The type of the model
 */
export interface IBaseController<T extends BaseModel> {
    create?(req: Request, res: Response, next: NextFunction): Promise<T | void>;
    findAll?(req: Request, res: Response, next: NextFunction): Promise<T[] | void>;
    findById?(req: Request, res: Response, next: NextFunction): Promise<T | void>;
    update?(req: Request, res: Response, next: NextFunction): Promise<T | void>;
    delete?(req: Request, res: Response, next: NextFunction): Promise<T | void>;
}
