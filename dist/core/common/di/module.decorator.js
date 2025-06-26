"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = Module;
exports.getModuleMetadata = getModuleMetadata;
require("reflect-metadata");
// constant
const di_token_constant_1 = require("./di-token.constant");
/**
 * Decorator to define a module
 * @param metadata Metadata for the module
 */
function Module(metadata) {
    return (target) => {
        // Show warning if routers are being used
        if (metadata.routers && metadata.routers.length > 0) {
            console.warn('The "routers" property in @Module is deprecated. Use @Controller with route decorators instead.');
        }
        const normalizedMetadata = {
            controllers: [],
            services: [],
            repositories: [],
            imports: [],
            exports: [],
            ...metadata,
        };
        Reflect.defineMetadata(di_token_constant_1.MODULE_METADATA_KEY, normalizedMetadata, target);
        return target;
    };
}
/**
 * Gets the module metadata
 * @param target The target to get metadata for
 * @returns The module metadata
 */
function getModuleMetadata(target) {
    return Reflect.getMetadata(di_token_constant_1.MODULE_METADATA_KEY, target);
}
//# sourceMappingURL=module.decorator.js.map