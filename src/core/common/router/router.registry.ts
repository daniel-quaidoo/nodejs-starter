import { Container, Service, Token } from 'typedi';

// interface
import { IModuleRouter } from '../interfaces/route.interface';

@Service()
export class RouterRegistry {
    private static instance: RouterRegistry;
    private routers: Map<Token<IModuleRouter>, IModuleRouter> = new Map();

    private constructor() {}

    public static getInstance(): RouterRegistry {
        if (!RouterRegistry.instance) {
            RouterRegistry.instance = new RouterRegistry();
        }
        return RouterRegistry.instance;
    }

    public registerRouter(token: Token<IModuleRouter>): void {
        const router = Container.get<IModuleRouter>(token);
        this.routers.set(token, router);
    }

    public getAllRouters(): IModuleRouter[] {
        return Array.from(this.routers.values());
    }
}

export const routerRegistry = RouterRegistry.getInstance();