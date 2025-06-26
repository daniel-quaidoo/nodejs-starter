"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = Component;
exports.Injectable = Injectable;
exports.Repository = Repository;
exports.Service = Service;
exports.Inject = Inject;
exports.getComponentMetadata = getComponentMetadata;
// interface
const module_interface_1 = require("../interfaces/module.interface");
// constant
const di_token_constant_1 = require("./di-token.constant");
function Component(metadata) {
    return (target) => {
        Reflect.defineMetadata(di_token_constant_1.INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata(di_token_constant_1.COMPONENT_METADATA_KEY, metadata, target);
        return target;
    };
}
function Injectable() {
    return (target) => {
        Reflect.defineMetadata(di_token_constant_1.INJECTABLE_METADATA_KEY, true, target);
        return target;
    };
}
function Repository() {
    return (target) => {
        Reflect.defineMetadata(di_token_constant_1.INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata(di_token_constant_1.COMPONENT_METADATA_KEY, { type: module_interface_1.COMPONENT_TYPE.REPOSITORY }, target);
        return target;
    };
}
function Service() {
    return (target) => {
        Reflect.defineMetadata(di_token_constant_1.INJECTABLE_METADATA_KEY, true, target);
        Reflect.defineMetadata(di_token_constant_1.COMPONENT_METADATA_KEY, { type: module_interface_1.COMPONENT_TYPE.SERVICE }, target);
        return target;
    };
}
function Inject() {
    return (target, _propertyKey) => {
        Reflect.defineMetadata(di_token_constant_1.INJECTABLE_METADATA_KEY, true, target);
        return target;
    };
}
function getComponentMetadata(target) {
    return Reflect.getMetadata(di_token_constant_1.COMPONENT_METADATA_KEY, target);
}
//# sourceMappingURL=component.decorator.js.map