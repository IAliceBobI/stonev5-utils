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
exports.copy2clipboard = copy2clipboard;
__exportStar(require("./array"), exports);
__exportStar(require("./cmd"), exports);
__exportStar(require("./desktop"), exports);
__exportStar(require("./dom"), exports);
__exportStar(require("./file"), exports);
__exportStar(require("./global"), exports);
__exportStar(require("./object"), exports);
__exportStar(require("./parallel"), exports);
__exportStar(require("./rand"), exports);
__exportStar(require("./string"), exports);
__exportStar(require("./time"), exports);
__exportStar(require("./functional"), exports);
async function copy2clipboard(text) {
    return navigator.clipboard.writeText(text);
}
