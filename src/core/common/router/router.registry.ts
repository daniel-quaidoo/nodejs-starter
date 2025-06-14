import { Service } from 'typedi';

// interface
import { IModuleRouter } from '../interfaces/route.interface';

@Service()
export class RouterRegistry {
    private routers = new Map<Function, () => IModuleRouter>();
    
    /**
     * Registers a router
     * @param token The token to register the router with
     * @param routerFactory The router factory
     */
    registerRouter(token: any, routerFactory: () => IModuleRouter): void {
        this.routers.set(token, routerFactory);
    }

    /**
     * Gets all routers
     * @returns The routers
     */
    getAllRouters(): IModuleRouter[] {
        return Array.from(this.routers.values()).map(factory => factory());
    }

    getRouter<T extends IModuleRouter>(token: new (...args: any[]) => T): T | undefined {
        const factory = this.routers.get(token);
        return factory ? (factory() as T) : undefined;
    }
}

export const routerRegistry = new RouterRegistry();
