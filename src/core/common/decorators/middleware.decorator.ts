import 'reflect-metadata';

export const MIDDLEWARE_METADATA_KEY = 'middleware:middlewares';

/**
 * Decorator to apply middleware to a controller or controller method
 * @param middlewares Array of middleware functions
 */
export function UseMiddleware(...middlewares: any[]): ClassDecorator & MethodDecorator {
    return (target: any, propertyKey?: string | symbol): void => {
        if (propertyKey) {
            // method decorator
            const existingMiddlewares =
                Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target.constructor, propertyKey) || [];
            Reflect.defineMetadata(
                MIDDLEWARE_METADATA_KEY,
                [...existingMiddlewares, ...middlewares],
                target.constructor,
                propertyKey
            );
        } else {
            // class decorator
            const existingMiddlewares = Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target) || [];
            Reflect.defineMetadata(
                MIDDLEWARE_METADATA_KEY,
                [...existingMiddlewares, ...middlewares],
                target
            );
        }
    };
}
