import { Token } from 'typedi';
import { RequestHandler, Router } from 'express';

// types
import { LambdaHandler } from '../types/route.types';

// interfaces
import { PaginationMeta } from './page-meta.interface';

/**
 * Generic API response interface
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    meta?: PaginationMeta;
    headers?: Record<string, any>;
    body?: any;
    statusCode?: number;
}

/**
 * Standardized error response format
 */
export interface ErrorResponse extends Omit<ApiResponse, 'data'> {
    statusCode?: number;
    details?: string;
    timestamp?: string;
    path?: string;
    method?: string;
    [key: string]: any;
}

/**
 * Standardized success response format
 */
export interface SuccessResponse<T = any> extends ApiResponse<T> {
    success: true;
    data: T;
}

/**
 * Interface for module routers
 */
export interface IModuleRouter {
    router: Router;
    getRoutes: () => RouteDefinition[];
    Token: Token<IModuleRouter>;
}

/**
 * Route definition interface
 */
export type HttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE';

export interface RouteDefinition {
    method: HttpMethod | string;
    path: string;
    handler?: LambdaHandler;
    handlerName?: string;
    middlewares?: RequestHandler[];
    absolutePath?: boolean;
}

export interface LambdaResponse {
    statusCode: number;
    headers?: Record<string, any>;
    body: string;
}

export interface RouteMetadata {
    path: string;
    method: string;
    handlerName: string;
    middlewares?: RequestHandler[];
}
