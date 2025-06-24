export * from './lib/array';
export * from './lib/cmd';
export * from './lib/desktop';
export * from './lib/dom';
export * from './lib/file';
export * from './lib/global';
export * from './lib/object';
export * from './lib/parallel';
export * from './lib/rand';
export * from './lib/string';
export * from './lib/time';

export async function copy2clipboard(text: string) {
    return navigator.clipboard.writeText(text)
}



