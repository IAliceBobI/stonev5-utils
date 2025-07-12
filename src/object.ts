export function set(obj: any, path: string, value: any) {
    if (!obj) obj = {}
    if (!path) {
        obj = value;
    } else {
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
    return obj
}

export function newProxy() {
    return new Proxy({}, {
        get(target: any, prop) {
            if (!(prop in target)) {
                target[prop] = new Proxy({}, this);
            }
            return target[prop];
        }
    });
}

export class RefObj<T> { v: T; constructor(v: T) { this.v = v; } }

export function isObject(value: any): boolean {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function isBoolean(value: any): boolean {
    return typeof value === "boolean";
}

export function isValidNumber(num: number) {
    return typeof num === "number" && !isNaN(num);
}

export function isStringNumber(str: string): boolean {
    return !isNaN(+str);
}

export function validateNum(num: any, v: number) {
    if (isValidNumber(num)) {
        return num;
    }
    return v;
}

export function objOverrideNull<T extends object>(includeNull: T, defaultValue: Partial<T>): T {
    const result = { ...includeNull };
    Object.keys(defaultValue).forEach((key) => {
        const typedKey = key as keyof T;
        if (result[typedKey] == null) {
            result[typedKey] = defaultValue[typedKey] as T[keyof T];
        }
    });
    return result;
}