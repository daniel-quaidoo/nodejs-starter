import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

// model
import { BaseModel } from '../entities/base.entity';

// dto
import { BaseQueryDto } from '../dto/base-query.dto';
import { BaseResponseDto } from '../dto/base-response.dto';

// guard
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';

// interfaces
import { IBaseService } from '../interfaces/base.service.interface';
import { IBaseController as IBaseControllerInterface } from '../interfaces/base.controller.interface';
import { AuthenticatedRequest } from '@/modules/auth/types';

export abstract class BaseController<T extends BaseModel> implements IBaseControllerInterface<T> {
    constructor(protected service: IBaseService<T>) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.create(req.body);
            res.status(201).json(
                BaseResponseDto.success(
                    entity,
                    undefined,
                    'Resource created successfully'
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Transform and validate query parameters
            const queryDto = plainToInstance(BaseQueryDto, req.query);
            const errors = await validate(queryDto);
            
            if (errors.length > 0) {
                const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
                res.status(400).json(
                    BaseResponseDto.error('Validation failed', errorMessages)
                );
                return;
            }
    
            // Convert DTO to TypeORM options
            const options = queryDto.toFindOptions();
            
            // Get data from service
            let count = 0;
            let entities: any[] = [];
            
            if (typeof this.service.findAndCount === 'function') {
                [entities, count] = await (this.service as any).findAndCount(options);
            } else if (typeof this.service.findAll === 'function') {
                entities = await this.service.findAll(options);
                count = entities.length;
            } else {
                throw new Error('Service does not implement required methods');
            }
            
            // Prepare pagination data
            const page = parseInt(queryDto.page || '1', 10);
            const limit = parseInt(queryDto.limit || '10', 10);
            
            res.status(200).json(
                BaseResponseDto.success(
                    entities,
                    { 
                        page, 
                        limit, 
                        total: count 
                    },
                    'Data retrieved successfully'
                )
            );
        } catch (error: any) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await (this.service as any).findOne(req.params.id);
            if (!entity) {
                res.status(404).json(
                    BaseResponseDto.error('Resource not found')
                );
                return;
            }
            res.status(200).json(
                BaseResponseDto.success(
                    entity,
                    undefined,
                    'Resource retrieved successfully'
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await (this.service as any).update(req.params.id, req.body);
            if (!entity) {
                res.status(404).json(
                    BaseResponseDto.error('Resource not found')
                );
                return;
            }
            res.status(200).json(
                BaseResponseDto.success(
                    entity,
                    undefined,
                    'Resource updated successfully'
                )
            );
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response | NextFunction, next?: NextFunction): Promise<void> {
        try {
            const success = await (this.service as any).delete(req.params.id);
            if (!success) {
                if ('status' in res) {
                    res.status(404).json(
                        BaseResponseDto.error('Resource not found')
                    );
                } else {
                    // Handle the case where res is NextFunction
                    const error = new Error('Resource not found');
                    (error as any).status = 404;
                    (res as NextFunction)(error);
                }
                return;
            }
            
            if ('status' in res) {
                res.status(200).json(
                    BaseResponseDto.success(
                        null,
                        undefined,
                        'Resource deleted successfully'
                    )
                );
            } else {
                // If res is NextFunction, call it without arguments to proceed
                (res as NextFunction)();
            }
        } catch (error) {
            if (next) {
                next(error);
            } else if ('status' in res) {
                // If next is not provided but res is a Response, send the error
                (res as Response).status(500).json(
                    BaseResponseDto.error(
                        'Internal server error',
                        error instanceof Error ? error.message : 'Unknown error'
                    )
                );
            } else {
                // If res is NextFunction and next is not provided, pass the error to res
                (res as NextFunction)(error);
            }
        }
    }
}
