"use strict";
// import { Token } from 'typedi';
// type ServiceKey<T = any> = string | Token<T> | (new (...args: any[]) => T);
// /**
//  * A simple service registry for managing service instances
//  */
// export class ServiceRegistry {
//     private static instance: ServiceRegistry;
//     private services = new Map<any, any>();
//     private constructor() {}
//     /**
//      * Gets the singleton instance of the service registry
//      */
//     public static getInstance(): ServiceRegistry {
//         if (!ServiceRegistry.instance) {
//             ServiceRegistry.instance = new ServiceRegistry();
//         }
//         return ServiceRegistry.instance;
//     }
//     /**
//      * Registers a service instance with the registry
//      * @param key The key to register the service with
//      * @param service The service instance
//      */
//     public registerService<T>(key: ServiceKey<T>, service: T): void {
//         this.services.set(key, service);
//     }
//     /**
//      * Gets a service from the registry
//      * @param key The key of the service to get
//      * @returns The service instance
//      * @throws Error if the service is not found
//      */
//     public getService<T>(key: ServiceKey<T>): T {
//         const service = this.services.get(key);
//         if (service === undefined) {
//             const keyName =
//                 typeof key === 'function' ? key.name : (key as any)?.name || String(key);
//             throw new Error(`Service not found for key: ${keyName}`);
//         }
//         return service as T;
//     }
//     /**
//      * Checks if a service is registered with the given key
//      * @param key The key to check
//      * @returns True if the service is registered, false otherwise
//      */
//     public hasService(key: ServiceKey): boolean {
//         return this.services.has(key);
//     }
//     /**
//      * Clears all registered services from the registry
//      */
//     public clear(): void {
//         this.services.clear();
//     }
// }
// export const serviceRegistry = ServiceRegistry.getInstance();
//# sourceMappingURL=service.registry.js.map