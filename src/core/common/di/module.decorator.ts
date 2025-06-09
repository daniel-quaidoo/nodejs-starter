import 'reflect-metadata';

export interface ModuleMetadata {
    controllers?: any[];
    services?: any[];
    repositories?: any[];
    imports?: any[];
    exports?: any[];
}

export const MODULE_METADATA_KEY = 'module:components';

export function Module(metadata: ModuleMetadata): ClassDecorator {
    return (target: any) => {
        // Validate metadata
        if (!metadata) {
            throw new Error('Module metadata cannot be undefined');
        }

        // Ensure all arrays are defined
        const normalizedMetadata: ModuleMetadata = {
            controllers: [],
            services: [],
            repositories: [],
            imports: [],
            exports: [],
            ...metadata
        };

        // Store the metadata
        Reflect.defineMetadata(MODULE_METADATA_KEY, normalizedMetadata, target);
        
        return target;
    };
}

// Helper function to get module metadata
export function getModuleMetadata(target: any): ModuleMetadata | undefined {
    return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}