"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const server = dgram_1.default.createSocket({ type: 'udp4', reuseAddr: true });
//# sourceMappingURL=multicast.js.map