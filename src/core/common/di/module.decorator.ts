import 'reflect-metadata';

export interface ModuleMetadata {
    controllers?: any[];
    services?: any[];
    repositories?: any[];
    routers?: any[];
    imports?: any[];
    exports?: any[];
}

export const MODULE_METADATA_KEY = 'module:components';

export function Module(metadata: ModuleMetadata): ClassDecorator {
    return (target: any) => {
        const normalizedMetadata: ModuleMetadata = {
            controllers: [],
            services: [],
            repositories: [],
            routers: [],
            imports: [],
            exports: [],
            ...metadata
        };
        Reflect.defineMetadata(MODULE_METADATA_KEY, normalizedMetadata, target);
        return target;
    };
}

export function getModuleMetadata(target: any): ModuleMetadata | undefined {
    return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}