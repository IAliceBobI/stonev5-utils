export function osFs() {
    return require('fs/promises') as typeof import('fs/promises');
}

export function osFsSync() {
    return require('fs') as typeof import('fs');
}

export function osPath() {
    return require('path') as typeof import('path');
}

