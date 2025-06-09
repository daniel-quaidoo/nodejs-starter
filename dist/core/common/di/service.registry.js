"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRegistry = exports.ServiceRegistry = void 0;
/**
 * A simple service registry for managing service instances
 */
class ServiceRegistry {
    constructor() {
        this.services = new Map();
    }
    /**
     * Gets the singleton instance of the service registry
     */
    static getInstance() {
        if (!ServiceRegistry.instance) {
            ServiceRegistry.instance = new ServiceRegistry();
        }
        return ServiceRegistry.instance;
    }
    /**
     * Registers a service instance with the registry
     * @param key The key to register the service with
     * @param service The service instance
     */
    registerService(key, service) {
        this.services.set(key, service);
    }
    /**
     * Gets a service from the registry
     * @param key The key of the service to get
     * @returns The service instance
     * @throws Error if the service is not found
     */
    getService(key) {
        const service = this.services.get(key);
        if (service === undefined) {
            const keyName = typeof key === 'function'
                ? key.name
                : key?.name || String(key);
            throw new Error(`Service not found for key: ${keyName}`);
        }
        return service;
    }
    /**
     * Checks if a service is registered with the given key
     * @param key The key to check
     * @returns True if the service is registered, false otherwise
     */
    hasService(key) {
        return this.services.has(key);
    }
    /**
     * Clears all registered services from the registry
     */
    clear() {
        this.services.clear();
    }
}
exports.ServiceRegistry = ServiceRegistry;
exports.serviceRegistry = ServiceRegistry.getInstance();
//# sourceMappingURL=service.registry.js.map