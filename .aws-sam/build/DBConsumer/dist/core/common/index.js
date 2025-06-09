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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Base Model
__exportStar(require("./entities/base.entity"), exports);
// Base Controller
__exportStar(require("./controller/base.controller"), exports);
// Base Service
__exportStar(require("./service/base.service"), exports);
// Base DAO
__exportStar(require("./dao/base.dao"), exports);
// Base Router
__exportStar(require("./router/base.router"), exports);
// Common interfaces
__exportStar(require("./interfaces/route.interface"), exports);
__exportStar(require("./interfaces/page-meta.interface"), exports);
//# sourceMappingURL=index.js.map