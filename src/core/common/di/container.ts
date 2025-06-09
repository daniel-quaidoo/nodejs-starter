import 'reflect-metadata';
import { ServiceRegistry } from './service.registry';
import { getInjectableToken, getInjectionTokens, getParamTypes } from './register.decorator';
import { Token } from './token';

// Type for class constructors that can be instantiated
type Constructor<T = any> = { new (...args: any[]): T };

// Type for abstract classes or interfaces
type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

// Union type that can be used for both concrete and abstract constructors
type ServiceIdentifier<T = any> = string | symbol | Constructor<T> | AbstractConstructor<T>;

/**
 * A simple dependency injection container
 */
export class DIContainer {
    private static instance: DIContainer;
    private serviceRegistry = ServiceRegistry.getInstance();

    private constructor() {}

    /**
     * Gets the singleton instance of the container
     */
    public static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    /**
     * Registers a service instance with the container
     * @param token The token to register the service with
     * @param instance The service instance (can be null for class registration)
     */
    public register<T>(
        token: Token<T> | Constructor<T> | AbstractConstructor<T>,
        instance: T | null = null
    ): void {
        if (instance !== null) {
            this.serviceRegistry.registerService(token, instance);
        } else if (typeof token === 'function') {
            // Register the class for later instantiation
            this.serviceRegistry.registerService(token, null as any);
        }
    }

    /**
     * Resolves a dependency from the container
     * @param target The token or constructor to resolve
     * @returns The resolved instance
     */
    public resolve<T>(target: Token<T> | Constructor<T> | AbstractConstructor<T>): T {
        // Check if the service is already registered
        if (this.serviceRegistry.hasService(target as any)) {
            const instance = this.serviceRegistry.getService<T>(target as any);
            if (instance) {
                return instance;
            }
        }

        // If it's a class constructor, try to instantiate it
        if (typeof target === 'function' && target.prototype) {
            return this.instantiateClass(target as Constructor<T>);
        }

        throw new Error(`Cannot resolve dependency: ${target instanceof Token ? target.name : String(target)}`);
    }

    /**
     * Instantiates a class with its dependencies
     * @param target The class to instantiate
     * @returns A new instance of the class
     */
    private instantiateClass<T>(target: Constructor<T> | AbstractConstructor<T>): T {
        // Check if the target is a function
        if (typeof target !== 'function') {
            throw new Error(`Cannot instantiate non-constructor: ${String(target)}`);
        }

        // Check if the target is abstract by checking if it has a prototype
        const isAbstract = target.prototype === undefined || 
                         (target.toString().startsWith('class ') && 
                          target.toString().includes('abstract class'));
        
        if (isAbstract) {
            throw new Error(`Cannot instantiate abstract class: ${target.name || 'unknown'}`);
        }

        // Verify this is a concrete constructor
        if (target.prototype && target.prototype.constructor === target) {
            // Get the parameter types and injection tokens
            const paramTypes: any[] = getParamTypes(target) || [];
            const injectionTokens = getInjectionTokens(target) || [];
            
            // Resolve each dependency
            const dependencies = paramTypes.map((paramType, index) => {
                const injectionToken = injectionTokens[index] || paramType;
                if (!injectionToken) {
                    throw new Error(`Cannot resolve parameter at index ${index} of ${target.name || 'anonymous class'}`);
                }
                return this.resolve(injectionToken);
            });

            try {
                // Create a new instance with the resolved dependencies
                const instance = new (target as Constructor<T>)(...dependencies);
                
                // Register the instance for future use
                this.serviceRegistry.registerService(target, instance);
                
                return instance;
            } catch (error) {
                throw new Error(`Failed to instantiate ${target.name || 'anonymous class'}: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            throw new Error(`Cannot instantiate non-constructor: ${target.name || 'unknown'}`);
        }
    }

    /**
     * Clears all registered services from the container
     */
    public clear(): void {
        this.serviceRegistry.clear();
    }

    /**
     * Gets a service from the container if it exists, otherwise returns undefined
     * @param target The token or constructor to get
     * @returns The service instance or undefined if not found
     */
    public get<T>(target: Token<T> | Constructor<T>): T | undefined {
        try {
            return this.resolve(target);
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Checks if a service is registered with the container
     * @param target The token or constructor to check
     * @returns True if the service is registered, false otherwise
     */
    public has(target: Token<any> | Constructor<any>): boolean {
        return this.serviceRegistry.hasService(target);
    }
}

export const container = DIContainer.getInstance();
