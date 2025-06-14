import { Request, Response, NextFunction } from 'express';

// model
import { BaseModel } from '../entities/base.entity';

export interface IBaseController<T extends BaseModel> {
    create?(req: Request, res: Response, next: NextFunction): Promise<void>;
    findAll?(req: Request, res: Response, next: NextFunction): Promise<void>;
    findById?(req: Request, res: Response, next: NextFunction): Promise<void>;
    update?(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete?(req: Request, res: Response, next: NextFunction): Promise<void>;
}
