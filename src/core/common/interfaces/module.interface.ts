import { Token } from 'typedi';

export interface ModuleMetadata {
    controllers?: any[];
    services?: any[];
    repositories?: any[];
    routers?: any[]; // @deprecated - Use controllers with route decorators instead
    imports?: any[];
    exports?: any[];
}

export interface ComponentMetadata {
    type: ComponentType;
    token?: Token<any>;
}

export const COMPONENT_TYPE = {
    ROUTER: 'router',
    SERVICE: 'service',
    REPOSITORY: 'repository',
    CONTROLLER: 'controller',
} as const;

export type ComponentType = (typeof COMPONENT_TYPE)[keyof typeof COMPONENT_TYPE];
