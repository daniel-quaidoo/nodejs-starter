"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.routerConfig = void 0;
const router = __importStar(require("aws-lambda-router"));
// config
const configuration_1 = require("../config/configuration");
// router registry
const router_registry_1 = require("./common/router/router.registry");
// utils
const utils_1 = require("../shared/utils");
const configService = new configuration_1.ConfigService();
const API_PREFIX = (configService.get('API_PREFIX') || '/api').replace(/\/+$/, '');
const allRoutes = router_registry_1.routerRegistry.getAllRouters().flatMap((moduleRouter) => {
    if (typeof moduleRouter.getRoutes === 'function') {
        return moduleRouter.getRoutes().map((route) => {
            const fullPath = route.path.startsWith('/')
                ? route.path
                : `/${route.path}`;
            return {
                method: route.method,
                path: `${API_PREFIX}${fullPath}`.replace(/\/+/g, '/'),
                action: (0, utils_1.wrapHandler)((0, utils_1.createLambdaHandler)(route.handler)),
            };
        });
    }
    return [];
});
exports.routerConfig = {
    proxyIntegration: {
        routes: allRoutes,
        cors: true,
        debug: false,
    },
};
exports.handler = router.handler(exports.routerConfig);
//# sourceMappingURL=routes.js.map