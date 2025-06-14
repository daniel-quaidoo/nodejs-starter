"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// dto
const base_query_dto_1 = require("../dto/base-query.dto");
const base_response_dto_1 = require("../dto/base-response.dto");
class BaseController {
    constructor(service) {
        this.service = service;
    }
    async create(req, res, next) {
        try {
            const entity = await this.service.create(req.body);
            res.status(201).json(base_response_dto_1.BaseResponseDto.success(entity, undefined, 'Resource created successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(req, res, next) {
        try {
            // Transform and validate query parameters
            const queryDto = (0, class_transformer_1.plainToInstance)(base_query_dto_1.BaseQueryDto, req.query);
            const errors = await (0, class_validator_1.validate)(queryDto);
            if (errors.length > 0) {
                const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
                res.status(400).json(base_response_dto_1.BaseResponseDto.error('Validation failed', errorMessages));
                return;
            }
            // Convert DTO to TypeORM options
            const options = queryDto.toFindOptions();
            // Get data from service
            let count = 0;
            let entities = [];
            if (typeof this.service.findAndCount === 'function') {
                [entities, count] = await this.service.findAndCount(options);
            }
            else if (typeof this.service.findAll === 'function') {
                entities = await this.service.findAll(options);
                count = entities.length;
            }
            else {
                throw new Error('Service does not implement required methods');
            }
            // Prepare pagination data
            const page = parseInt(queryDto.page || '1', 10);
            const limit = parseInt(queryDto.limit || '10', 10);
            res.status(200).json(base_response_dto_1.BaseResponseDto.success(entities, {
                page,
                limit,
                total: count
            }, 'Data retrieved successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const entity = await this.service.findOne(req.params.id);
            if (!entity) {
                res.status(404).json(base_response_dto_1.BaseResponseDto.error('Resource not found'));
                return;
            }
            res.status(200).json(base_response_dto_1.BaseResponseDto.success(entity, undefined, 'Resource retrieved successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const entity = await this.service.update(req.params.id, req.body);
            if (!entity) {
                res.status(404).json(base_response_dto_1.BaseResponseDto.error('Resource not found'));
                return;
            }
            res.status(200).json(base_response_dto_1.BaseResponseDto.success(entity, undefined, 'Resource updated successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const success = await this.service.delete(req.params.id);
            if (!success) {
                if ('status' in res) {
                    res.status(404).json(base_response_dto_1.BaseResponseDto.error('Resource not found'));
                }
                else {
                    // Handle the case where res is NextFunction
                    const error = new Error('Resource not found');
                    error.status = 404;
                    res(error);
                }
                return;
            }
            if ('status' in res) {
                res.status(200).json(base_response_dto_1.BaseResponseDto.success(null, undefined, 'Resource deleted successfully'));
            }
            else {
                // If res is NextFunction, call it without arguments to proceed
                res();
            }
        }
        catch (error) {
            if (next) {
                next(error);
            }
            else if ('status' in res) {
                // If next is not provided but res is a Response, send the error
                res.status(500).json(base_response_dto_1.BaseResponseDto.error('Internal server error', error instanceof Error ? error.message : 'Unknown error'));
            }
            else {
                res(error);
            }
        }
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map