// constant
import { COMPONENT_METADATA_KEY, INJECTABLE_METADATA_KEY } from './di-token.constant';

// interface
import { ComponentMetadata } from '../interfaces/module.interface';

export function Component(metadata: ComponentMetadata): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata(COMPONENT_METADATA_KEY, metadata, target);
        return target;
    };
}

export function getComponentMetadata(target: any): ComponentMetadata | undefined {
    return Reflect.getMetadata(COMPONENT_METADATA_KEY, target);
}
