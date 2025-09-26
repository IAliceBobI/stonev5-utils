"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobal = getGlobal;
exports.setGlobal = setGlobal;
const prefix = "11aUa1WLNBpAf1CWCSZwZ4eEt3D78";
function getGlobal(key) {
    const globalThisAny = globalThis;
    return globalThisAny[prefix + key];
}
function setGlobal(key, v) {
    const globalThisAny = globalThis;
    const old = globalThisAny[prefix + key];
    globalThisAny[prefix + key] = v;
    return old;
}
