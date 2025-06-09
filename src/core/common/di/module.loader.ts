import { Service } from 'typedi';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';

// decoratos
import { getModuleMetadata } from './module.decorator';
import { COMPONENT_TYPE } from './component.decorator';
import { getComponentMetadata } from './component.decorator';

// router registry
import { routerRegistry } from '../router/router.registry';

@Service()
export class ModuleLoader {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public async loadModules(modules: any[]): Promise<void> {
        for (const module of modules) {
            await this.registerModule(module);
        }
    }
    private async registerModule(Module: any): Promise<void> {
        const metadata = getModuleMetadata(Module);
        if (!metadata) return;

        // Register components in the correct order
        await this.registerComponents(metadata.repositories || [], COMPONENT_TYPE.REPOSITORY);
        await this.registerComponents(metadata.services || [], COMPONENT_TYPE.SERVICE);
        await this.registerComponents(metadata.controllers || [], COMPONENT_TYPE.CONTROLLER);
        await this.registerComponents(metadata.routers || [], COMPONENT_TYPE.ROUTER);
    }

    private async registerComponents(components: any[], type: string): Promise<void> {
        for (const Component of components) {
            const metadata = getComponentMetadata(Component) || { type };
            if (metadata.type !== type) continue;

            switch (metadata.type) {
                case COMPONENT_TYPE.REPOSITORY:
                    await this.registerRepository(Component);
                    break;
                case COMPONENT_TYPE.SERVICE:
                    this.registerService(Component);
                    break;
                case COMPONENT_TYPE.CONTROLLER:
                    this.registerController(Component);
                    break;
                case COMPONENT_TYPE.ROUTER:
                    this.registerRouter(Component);
                    break;
            }
        }
    }

    private async registerRepository(Repository: any): Promise<void> {
        const instance = new Repository(this.dataSource);
        Container.set(Repository, instance);
    }

    private registerService(Service: any): void {
        const deps = this.getDependencies(Service);
        const instance = new Service(...deps);
        Container.set(Service, instance);
    }

    private registerController(Controller: any): void {
        const deps = this.getDependencies(Controller);
        const instance = new Controller(...deps);
        Container.set(Controller, instance);
    }

    private registerRouter(Router: any): void {
        const deps = this.getDependencies(Router);
        const instance = new Router(...deps);
        Container.set(Router.Token, instance);
        routerRegistry.registerRouter(Router.Token);
    }

    private getDependencies(Target: any): any[] {
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', Target) || [];
        return paramTypes.map((param) => {
            try {
                return Container.get(param);
            } catch (error) {
                throw new Error(`Failed to resolve dependency ${param?.name} for ${Target.name}`);
            }
        });
    }
}