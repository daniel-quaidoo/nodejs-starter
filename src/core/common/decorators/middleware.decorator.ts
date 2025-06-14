import 'reflect-metadata';

export const MIDDLEWARE_METADATA_KEY = 'middleware:middlewares';

export function UseMiddleware(...middlewares: any[]) {
    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
        if (propertyKey) {
            // Method decorator
            const existingMiddlewares = Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target.constructor, propertyKey) || [];
            Reflect.defineMetadata(
                MIDDLEWARE_METADATA_KEY,
                [...existingMiddlewares, ...middlewares],
                target.constructor,
                propertyKey
            );
        } else {
            // Class decorator
            const existingMiddlewares = Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target) || [];
            Reflect.defineMetadata(
                MIDDLEWARE_METADATA_KEY,
                [...existingMiddlewares, ...middlewares],
                target
            );
        }
    };
}