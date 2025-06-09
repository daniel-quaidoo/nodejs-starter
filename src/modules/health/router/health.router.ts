import { Service, Token, Inject } from 'typedi';
import { APIGatewayProxyResult } from 'aws-lambda';
import { NextFunction, Request, Response, Router } from 'express';

// controller
import { HealthController } from '../controller/health.controller';

// interface
import { IModuleRouter, RouteDefinition } from '../../../core/common/interfaces/route.interface';

// HealthRouter token
const HEALTH_ROUTER_TOKEN = new Token<HealthRouter>('HealthRouter');

@Service()
export class HealthRouter implements IModuleRouter {
    public router: Router = Router();
    public Token = HEALTH_ROUTER_TOKEN;
    public static Token = HEALTH_ROUTER_TOKEN;

    constructor(@Inject(() => HealthController) private readonly healthController: HealthController) {
        this.initializeRoutes();
    }

    public getRoutes(): RouteDefinition[] {
        const healthCheckHandler = async (event: any, context: any, next: any): Promise<APIGatewayProxyResult> => {
            try {
                // For Lambda, we call the getHealthStatus method directly
                const healthStatus = await this.healthController.checkHealth(event, context, next);
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(healthStatus)
                };
            } catch (error: any) {
                console.error('Health check failed:', error);
                const statusCode = error?.statusCode || 500;
                const errorMessage = error?.message || 'Internal Server Error';
                
                return {
                    statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: errorMessage,
                        data: {
                            statusCode,
                            timestamp: new Date().toISOString(),
                            path: event?.path || '',
                            method: event?.httpMethod || ''
                        },
                        ...(process.env.NODE_ENV === 'development' && error.stack && { 
                            details: error.stack 
                        })
                    }),
                    isBase64Encoded: false
                };
            }
        };

        return [
            {
                method: 'GET',
                path: '/health',
                handler: healthCheckHandler
            },
            {
                method: 'GET',
                path: '/liveness',
                handler: healthCheckHandler
            },
            {
                method: 'GET',
                path: '/readiness',
                handler: healthCheckHandler
            }
        ];
    }

    private initializeRoutes(): void {
        this.getRoutes().forEach(route => {
            const path = route.path.startsWith('/') ? route.path : `/${route.path}`;
            
            (this.router as any)[route.method.toLowerCase()](path, 
                async (req: Request, res: Response, next: NextFunction) => {
                    try {
                        await this.healthController.checkHealth(req, res, next);
                    } catch (error) {
                        next(error);
                    }
                }
            );
        });
    }
}