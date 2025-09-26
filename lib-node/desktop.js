"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.osFs = osFs;
exports.osFsSync = osFsSync;
exports.osPath = osPath;
function osFs() {
    return require('fs/promises');
}
function osFsSync() {
    return require('fs');
}
function osPath() {
    return require('path');
}
