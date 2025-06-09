"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPONENT_TYPE = void 0;
exports.Component = Component;
exports.getComponentMetadata = getComponentMetadata;
// token
const di_token_constant_1 = require("./di-token.constant");
exports.COMPONENT_TYPE = {
    ROUTER: 'router',
    SERVICE: 'service',
    REPOSITORY: 'repository',
    CONTROLLER: 'controller'
};
function Component(metadata) {
    return (target) => {
        Reflect.defineMetadata(di_token_constant_1.INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata('component:metadata', metadata, target);
        return target;
    };
}
function getComponentMetadata(target) {
    return Reflect.getMetadata('component:metadata', target);
}
//# sourceMappingURL=component.decorator.js.map