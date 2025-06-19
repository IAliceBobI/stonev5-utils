export function joinArray<T>(array: T[], factory: () => T): T[] {
    if (!array) return [];
    return array.flatMap((value, index, arr) => {
        if (index === arr.length - 1) {
            return [value];
        }
        return [value, factory()];
    });
}

export function arrayDeleteFromLeft<T>(list: T[], keep: (i: T, idx: number, arr: T[]) => boolean) {
    for (let i = 0; i < list.length; i++) {
        if (!keep(list[i], i, list)) {
            list.splice(i, 1);
            i--;
        }
    }
    return list;
}

export function pushNotNull<T>(arr: T[] | undefined, ...items: T[]): T[] {
    if (!arr) arr = [];
    if (items != null) {
        for (const i of items) {
            if (i != null) {
                arr.push(i);
            }
        }
    }
    return arr;
}

export function removeFromArr<T>(arr: T[] | undefined, ...items: T[]): T[] {
    if (!arr) arr = [];
    for (let i = 0; i < items.length; i++) {
        // 由于 items.at(i) 可能返回 undefined，而 indexOf 方法期望的参数类型是 T，因此需要先检查是否为 undefined
        const item = items.at(i);
        const idx = item != undefined ? arr.indexOf(item) : -1;
        if (idx >= 0) {
            arr.splice(idx, 1)
            i--
        }
    }
    return arr;
}

export function pushUniq<T>(arr: T[] | undefined, ...items: T[]): T[] {
    if (!arr) arr = [];
    for (const i of items) {
        const idx = arr.indexOf(i)
        if (idx >= 0) continue
        arr.push(i)
    }
    return arr;
}

export function push<T>(arr: T[] | undefined, ...items: T[]): T[] {
    if (!arr) arr = [];
    arr.push(...items);
    return arr;
}

export function* count(end: number) {
    for (let i = 0; i < end; i++) {
        yield i;
    }
}

export function* getRange(start: number, end: number) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}

export function arrayRemove<T>(array: T[], element: T) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}

export function sortedMap<K, V>(map: Map<K, V>, compareFn?: (a: [K, V], b: [K, V]) => number) {
    return new Map([...map.entries()].sort(compareFn));
}

export function divideArrayIntoParts<T>(array: T[], n: number): T[][] {
    n = Math.ceil(array.length / n);
    return chunks(array, n);
}

export function chunks<T>(array: T[], n: number): T[][] {
    const newArr: T[][] = [];
    for (let i = 0; i < array.length; i += n) {
        const part = array.slice(i, i + n);
        if (part.length > 0) newArr.push(part);
    }
    return newArr;
}

export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function uniqueFilter<T>(keySelector: (item: T) => any) {
    const seen = new Set<any>();
    return (item: T) => {
        const key = keySelector(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    };
};


