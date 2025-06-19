export * from './array';
export * from './cmd';
export * from './desktop';
export * from './dom';
export * from './file';
export * from './global';
export * from './object';
export * from './parallel';
export * from './rand';
export * from './string';
export * from './time';

export async function copy2clipboard(text: string) {
    return navigator.clipboard.writeText(text)
}



