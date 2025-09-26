"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMd5 = getMd5;
const ts_md5_1 = require("ts-md5");
function getMd5(str) {
    const md5 = new ts_md5_1.Md5();
    md5.appendStr(str);
    return md5.end()?.toString() ?? "";
}
