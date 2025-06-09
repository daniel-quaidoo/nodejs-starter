import 'reflect-metadata';
import { Token } from './token';

export const INJECTABLE_METADATA_KEY = 'injectable';
export const INJECT_METADATA_KEY = 'inject:tokens';

export function Injectable(token?: any): ClassDecorator {
    return (target: any) => {
        // Mark the class as injectable
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        
        // If no token is provided, use the class itself
        const serviceToken = token || target;
        
        // Store the token in metadata
        Reflect.defineMetadata('inject:token', serviceToken, target);

        return target;
    };
}

export function Inject(token?: any): ParameterDecorator {
    return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
        // Get the constructor parameters types
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        
        // Get existing inject tokens or initialize an empty array
        const injectTokens = Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) || [];
        
        // Use the provided token or fall back to the type from design:paramtypes
        const injectToken = token || paramTypes[parameterIndex];
        
        if (!injectToken) {
            throw new Error(`Cannot inject dependency at index ${parameterIndex} of ${target.name || 'anonymous'} class`);
        }
        
        // Add the token at the correct parameter index
        injectTokens[parameterIndex] = injectToken;
        
        // Save the tokens back to metadata
        Reflect.defineMetadata(INJECT_METADATA_KEY, injectTokens, target);

        return target;
    };
}

// Helper function to get injectable token from a class
export function getInjectableToken(target: any): any {
    return Reflect.getMetadata('inject:token', target) || target;
}

// Helper function to get parameter types for a class
export function getParamTypes(target: any): any[] {
    return Reflect.getMetadata('design:paramtypes', target) || [];
}

// Helper function to get injection tokens for a class
export function getInjectionTokens(target: any): any[] {
    return Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
}