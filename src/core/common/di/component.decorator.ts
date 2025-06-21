// interface
import { COMPONENT_TYPE, ComponentMetadata } from '../interfaces/module.interface';

// constant
import { COMPONENT_METADATA_KEY, INJECTABLE_METADATA_KEY } from './di-token.constant';

export function Component(metadata: ComponentMetadata): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata(COMPONENT_METADATA_KEY, metadata, target);
        return target;
    };
}

export function Injectable(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        return target;
    };
}

export function Repository(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata(COMPONENT_METADATA_KEY, { type: COMPONENT_TYPE.REPOSITORY }, target);
        return target;
    };
}

export function Service(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata(COMPONENT_METADATA_KEY, { type: COMPONENT_TYPE.SERVICE }, target);
        return target;
    };
}

export function Inject(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        return target;
    };
}

export function getComponentMetadata(target: any): ComponentMetadata | undefined {
    return Reflect.getMetadata(COMPONENT_METADATA_KEY, target);
}
