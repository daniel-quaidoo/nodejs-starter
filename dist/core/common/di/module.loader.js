"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleLoader = void 0;
const typedi_1 = require("typedi");
const typedi_2 = require("typedi");
const typeorm_1 = require("typeorm");
// decoratos
const module_decorator_1 = require("./module.decorator");
const component_decorator_1 = require("./component.decorator");
const component_decorator_2 = require("./component.decorator");
// router registry
const router_registry_1 = require("../router/router.registry");
const controller_router_1 = require("./controller.router");
let ModuleLoader = class ModuleLoader {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async loadModules(modules) {
        for (const module of modules) {
            await this.registerModule(module);
        }
    }
    async registerModule(Module) {
        const metadata = (0, module_decorator_1.getModuleMetadata)(Module);
        if (!metadata)
            return;
        // Register components in the correct order
        await this.registerComponents(metadata.repositories || [], component_decorator_1.COMPONENT_TYPE.REPOSITORY);
        await this.registerComponents(metadata.services || [], component_decorator_1.COMPONENT_TYPE.SERVICE);
        await this.registerComponents(metadata.controllers || [], component_decorator_1.COMPONENT_TYPE.CONTROLLER);
        await this.registerComponents(metadata.routers || [], component_decorator_1.COMPONENT_TYPE.ROUTER);
    }
    async registerComponents(components, type) {
        for (const Component of components) {
            const metadata = (0, component_decorator_2.getComponentMetadata)(Component) || { type };
            if (metadata.type !== type)
                continue;
            switch (metadata.type) {
                case component_decorator_1.COMPONENT_TYPE.REPOSITORY:
                    await this.registerRepository(Component);
                    break;
                case component_decorator_1.COMPONENT_TYPE.SERVICE:
                    this.registerService(Component);
                    break;
                case component_decorator_1.COMPONENT_TYPE.CONTROLLER:
                    this.registerController(Component);
                    break;
                case component_decorator_1.COMPONENT_TYPE.ROUTER:
                    this.registerRouter(Component);
                    break;
            }
        }
    }
    async registerRepository(Repository) {
        const instance = new Repository(this.dataSource);
        typedi_2.Container.set(Repository, instance);
    }
    registerService(Service) {
        const deps = this.getDependencies(Service);
        const instance = new Service(...deps);
        typedi_2.Container.set(Service, instance);
    }
    registerController(Controller) {
        // const deps = this.getDependencies(Controller);
        // const instance = new Controller(...deps);
        // Container.set(Controller, instance);
        try {
            // Get controller dependencies and create instance
            const deps = this.getDependencies(Controller);
            const controller = new Controller(...deps);
            // Register the controller in the container
            typedi_2.Container.set(Controller, controller);
            // Create and register the router
            const controllerRouter = new controller_router_1.ControllerRouter(controller);
            // Add router to the registry
            if (controllerRouter.Token) {
                // Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
                //     .filter(prop => typeof controller[prop] === 'function' && prop !== 'constructor')
                //     .forEach(method => {
                //         controller[method] = controller[method].bind(controller);
                //     });
                console.log(`✓ Registered controller: ${Controller.name}`);
                router_registry_1.routerRegistry.registerRouter(controllerRouter.Token, () => controllerRouter);
            }
        }
        catch (error) {
            console.error(`Failed to register controller ${Controller?.name || 'unknown'}:`, error);
            throw error;
        }
    }
    registerRouter(Router) {
        const deps = this.getDependencies(Router);
        const instance = new Router(...deps);
        typedi_2.Container.set(Router.Token, instance);
        router_registry_1.routerRegistry.registerRouter(Router.Token, () => instance);
    }
    getDependencies(Target) {
        const paramTypes = Reflect.getMetadata('design:paramtypes', Target) || [];
        return paramTypes.map((param) => {
            try {
                return typedi_2.Container.get(param);
            }
            catch (error) {
                throw new Error(`Failed to resolve dependency ${param?.name} for ${Target.name}`);
            }
        });
    }
};
exports.ModuleLoader = ModuleLoader;
exports.ModuleLoader = ModuleLoader = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ModuleLoader);
//# sourceMappingURL=module.loader.js.map