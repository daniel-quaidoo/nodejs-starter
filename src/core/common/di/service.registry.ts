import { Container, Service, Token } from 'typedi';

type ServiceKey = string | Token<any> | (new (...args: any[]) => any);

@Service()
export class ServiceRegistry {
    private static instance: ServiceRegistry;
    private services: Map<string, any> = new Map();

    private constructor() {}

    public static getInstance(): ServiceRegistry {
        if (!ServiceRegistry.instance) {
            ServiceRegistry.instance = new ServiceRegistry();
        }
        return ServiceRegistry.instance;
    }

    public registerService(key: ServiceKey, service: any): void {
        Container.set(key as any, service);
        const serviceKey = typeof key === 'string' ? key : key.name;
        this.services.set(serviceKey as any, service);
    }

    public getService<T>(key: ServiceKey): T {
        return Container.get<T>(key as any);
    }

    public getAllServices(): Map<string, any> {
        return new Map(this.services);
    }
}

export const serviceRegistry = ServiceRegistry.getInstance();
