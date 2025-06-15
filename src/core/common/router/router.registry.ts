import { Service } from 'typedi';

// interface
import { IModuleRouter } from '../interfaces/route.interface';

@Service()
export class RouterRegistry {
    private routers = new Map<string, () => IModuleRouter>();

    /**
     * Registers a router
     * @param token The token to register the router with
     * @param routerFactory The router factory
     */
    registerRouter(token: string, routerFactory: () => IModuleRouter): void {
        this.routers.set(token, routerFactory);
    }

    /**
     * Gets all routers
     * @returns The routers
     */
    getAllRouters(): IModuleRouter[] {
        return Array.from(this.routers.values()).map(factory => factory());
    }

    /**
     * Gets a router by token
     * @param token The token to get the router for
     * @returns The router instance or undefined if not found
     */
    getRouter<T extends IModuleRouter>(token: string): T | undefined {
        const factory = this.routers.get(token);
        return factory ? (factory() as T) : undefined;
    }
}

// Export a singleton instance
export const routerRegistry = new RouterRegistry();
