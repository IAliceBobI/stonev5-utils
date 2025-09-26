export * from './array.js';
export * from './cmd.js';
export * from './desktop.js';
export * from './dom.js';
export * from './file.js';
export * from './global.js';
export * from './object.js';
export * from './parallel.js';
export * from './rand.js';
export * from './string.js';
export * from './time.js';
export * from './functional.js';

export async function copy2clipboard(text: string) {
    return navigator.clipboard.writeText(text)
}



