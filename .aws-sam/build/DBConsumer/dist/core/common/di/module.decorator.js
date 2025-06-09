"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_METADATA_KEY = void 0;
exports.Module = Module;
exports.getModuleMetadata = getModuleMetadata;
require("reflect-metadata");
exports.MODULE_METADATA_KEY = 'module:components';
function Module(metadata) {
    return (target) => {
        const normalizedMetadata = {
            controllers: [],
            services: [],
            repositories: [],
            routers: [],
            imports: [],
            exports: [],
            ...metadata
        };
        Reflect.defineMetadata(exports.MODULE_METADATA_KEY, normalizedMetadata, target);
        return target;
    };
}
function getModuleMetadata(target) {
    return Reflect.getMetadata(exports.MODULE_METADATA_KEY, target);
}
//# sourceMappingURL=module.decorator.js.map