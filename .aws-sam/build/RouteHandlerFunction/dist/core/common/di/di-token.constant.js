"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEALTH_ROUTER_TOKEN = exports.USER_ROUTER_TOKEN = exports.INJECTABLE_METADATA_KEY = exports.INJECT_METADATA_KEY = void 0;
const typedi_1 = require("typedi");
exports.INJECT_METADATA_KEY = 'inject:tokens';
exports.INJECTABLE_METADATA_KEY = 'injectable';
exports.USER_ROUTER_TOKEN = new typedi_1.Token('UserRouter');
exports.HEALTH_ROUTER_TOKEN = new typedi_1.Token('HealthRouter');
//# sourceMappingURL=di-token.constant.js.map