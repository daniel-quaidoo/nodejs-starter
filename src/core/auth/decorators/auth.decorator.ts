import { Request, Response, NextFunction } from 'express';
import { ROUTE_METADATA_KEY } from '../../../core/common/di/component.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function Auth(roles: string[] = []) {
    console.log('Auth decorator called with roles:', roles);

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const routes = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
        const routeIndex = routes.findIndex((r: any) => r.handlerName === propertyKey);

        if (routeIndex !== -1) {
            // Add auth metadata
            routes[routeIndex].auth = {
                required: true,
                roles: Array.isArray(roles) ? roles : [roles]
            };
            
            // Get the original method
            const originalMethod = descriptor.value;
            
            // Create a new method that wraps the original with the guard
            descriptor.value = function(req: Request, res: Response, next: NextFunction) {
                // First apply the JWT guard
                return JwtAuthGuard(req, res, (err?: any) => {
                    if (err) {
                        return next(err);
                    }
                    
                    // Then check roles if any are specified
                    if (roles.length > 0) {
                        const userRoles = (req as any).user?.role || [];
                        const hasRequiredRole = roles.some(role => userRoles.includes(role));
                        
                        if (!hasRequiredRole) {
                            return res.status(403).json({
                                success: false,
                                message: 'Insufficient permissions'
                            });
                        }
                    }
                    
                    // If all checks pass, call the original method
                    return originalMethod.apply(this, [req, res, next]);
                });
            };

            Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor);
        } else {
            console.warn(`Auth decorator: No route found for method ${propertyKey}`);
        }
        
        return descriptor;
    };
}