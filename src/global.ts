
const prefix = "11aUa1WLNBpAf1CWCSZwZ4eEt3D78"

export function getGlobal<T>(key: string): T {
    const globalThisAny = globalThis as Record<string, any>;
    return globalThisAny[prefix + key];
}

export function setGlobal<T>(key: string, v: T): T {
    const globalThisAny = globalThis as Record<string, any>;
    const old = globalThisAny[prefix + key];
    globalThisAny[prefix + key] = v
    return old;
}



