import { Token } from 'typedi';

// token
import { INJECTABLE_METADATA_KEY } from './di-token.constant';

export const COMPONENT_TYPE = {
    ROUTER: 'router',
    SERVICE: 'service',
    REPOSITORY: 'repository',
    CONTROLLER: 'controller',
} as const;

export const ROUTE_METADATA_KEY = 'routes';
export const CONTROLLER_METADATA_KEY = 'controller';

export type ComponentType = (typeof COMPONENT_TYPE)[keyof typeof COMPONENT_TYPE];

export interface ComponentMetadata {
    type: ComponentType;
    token?: Token<any>;
}

export function Component(metadata: ComponentMetadata): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata('component:metadata', metadata, target);
        return target;
    };
}

export function getComponentMetadata(target: any): ComponentMetadata | undefined {
    return Reflect.getMetadata('component:metadata', target);
}
