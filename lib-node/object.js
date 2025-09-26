"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefObj = void 0;
exports.set = set;
exports.newProxy = newProxy;
exports.isObject = isObject;
exports.clone = clone;
exports.isBoolean = isBoolean;
exports.isValidNumber = isValidNumber;
exports.isStringNumber = isStringNumber;
exports.validateNum = validateNum;
exports.objOverrideNull = objOverrideNull;
function set(obj, path, value) {
    if (!obj)
        obj = {};
    if (!path) {
        obj = value;
    }
    else {
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (typeof current[part] !== 'object' || current[part] === null) {
                current[part] = {};
            }
            current = current[part];
        }
        current[parts[parts.length - 1]] = value;
    }
    return obj;
}
function newProxy() {
    return new Proxy({}, {
        get(target, prop) {
            if (!(prop in target)) {
                target[prop] = new Proxy({}, this);
            }
            return target[prop];
        }
    });
}
class RefObj {
    v;
    constructor(v) { this.v = v; }
}
exports.RefObj = RefObj;
function isObject(value) {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function isBoolean(value) {
    return typeof value === "boolean";
}
function isValidNumber(num) {
    return typeof num === "number" && !isNaN(num);
}
function isStringNumber(str) {
    return !isNaN(+str);
}
function validateNum(num, v) {
    if (isValidNumber(num)) {
        return num;
    }
    return v;
}
function objOverrideNull(includeNull, defaultValue) {
    Object.keys(defaultValue).forEach((key) => {
        const typedKey = key;
        if (includeNull[typedKey] == null) {
            includeNull[typedKey] = defaultValue[typedKey];
        }
    });
    return includeNull;
}
