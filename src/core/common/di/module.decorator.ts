import 'reflect-metadata';

export interface ModuleMetadata {
    controllers?: any[];
    services?: any[];
    repositories?: any[];
    routers?: any[]; // @deprecated - Use controllers with route decorators instead
    imports?: any[];
    exports?: any[];
}

export const MODULE_METADATA_KEY = 'module:components';

/**
 * Decorator to define a module
 * @param metadata Metadata for the module
 */
export function Module(metadata: ModuleMetadata): ClassDecorator {
    return (target: any) => {
        // Show warning if routers are being used
        if (metadata.routers && metadata.routers.length > 0) {
            console.warn('The "routers" property in @Module is deprecated. Use @Controller with route decorators instead.');
        }

        const normalizedMetadata: ModuleMetadata = {
            controllers: [],
            services: [],
            repositories: [],
            imports: [],
            exports: [],
            ...metadata
        };
        
        Reflect.defineMetadata(MODULE_METADATA_KEY, normalizedMetadata, target);
        return target;
    };
}

/**
 * Gets the module metadata
 * @param target The target to get metadata for
 * @returns The module metadata
 */
export function getModuleMetadata(target: any): ModuleMetadata | undefined {
    return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}