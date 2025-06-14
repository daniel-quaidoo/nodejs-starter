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
const passport_1 = require("./auth/passport");
const session_1 = require("./middleware/session");
const configService = new configuration_1.ConfigService();
const API_PREFIX = (configService.get('API_PREFIX') || '/api').replace(/\/+$/, '');
// configure passport
const passport = (0, passport_1.configurePassport)();
// create routes
const allRoutes = router_registry_1.routerRegistry.getAllRouters().flatMap((moduleRouter) => {
    // moduleRouter.router.use(sessionMiddleware);
    // moduleRouter.router.use(passport.initialize());
    // moduleRouter.router.use(passport.session());
    moduleRouter.router.use(passport_1.passportMiddleware);
    moduleRouter.router.use(passport_1.passportSessionMiddleware);
    // moduleRouter.router.use(
    //     session({
    //         secret: process.env.SESSION_SECRET || 'your-secret-key',
    //         resave: false,
    //         saveUninitialized: false,
    //         cookie: {
    //             secure: process.env.NODE_ENV === 'production',
    //             maxAge: 24 * 60 * 60 * 1000, // 24 hours
    //         },
    //     })
    // );
    if (typeof moduleRouter.getRoutes === 'function') {
        return moduleRouter.getRoutes().map((route) => {
            const fullPath = route.path.startsWith('/')
                ? route.path
                : `/${route.path}`;
            return {
                method: route.method,
                path: `${API_PREFIX}${(0, utils_1.normalizePath)(fullPath)}`.replace(/\/+/g, '/'),
                action: (0, utils_1.wrapHandler)((0, utils_1.createLambdaHandler)(route.handler)),
                middleware: [session_1.sessionMiddleware, passport_1.initializePassport, passport_1.passportMiddleware, passport_1.passportSessionMiddleware],
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