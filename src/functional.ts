export function into<U>(fn: () => U) {
    return fn();
}

export function objectToMap<V>(obj: Record<string, V>): Map<string, V> {
    const map = new Map<string, V>();
    // 处理字符串键
    Object.entries(obj).forEach(([key, value]) => {
        map.set(key, value);
    });
    return map;
};

export function objectEntriesWithKeyFilter<V>(obj: Record<string, V>, filter: (key: string) => boolean): [string, V][] {
    const entries: [string, V][] = [];
    if (typeof filter !== 'function') {
        return entries
    }
    // 处理字符串键
    Object.entries(obj).forEach(([key, value]) => {
        if (filter(key)) {
            entries.push([key, value]);
        }
    });
    return entries;
};

declare global {
    interface Array<T> {
        asyncMap<U, K = Awaited<U>>(
            callback: (value: T, index: number) => U | Promise<U>,
            postMap?: (value: Awaited<U>, index: number) => K | Promise<K>
        ): Promise<Awaited<K>[]>;
        uniq<V = T>(fn?: (value: T, index: number) => V): T[];
        chunks(size: number): T[][];
        group<U>(callback: (value: T, index: number, array: T[]) => U, shouldSort?: boolean): T[][];
        shuffle(): T[];
        toMapMk<K, V>(callback: (value: T, index?: number) => [K[], V]): Map<K, V[]>;
        toMapMkUniq<K, V>(callback: (value: T, index?: number) => [K[], V]): Map<K, V>;
        toMap<K, V>(callback: (value: T, index?: number) => [K, V]): Map<K, V[]>;
        toMapUniq<K, V>(callback: (value: T, index?: number) => [K, V]): Map<K, V>;
        toSet<K>(callback: (value: T, index?: number) => K): Set<K>;
        mapfilter<U>(callback: (value: T, index?: number) => U | null | undefined): U[];
        swap(
            index1: number | ((value: T, index: number, array: T[]) => boolean),
            index2: number | ((value: T, index: number, array: T[]) => boolean)
        ): this;
        remove(predicate: (value: T, index: number, array: T[]) => boolean): this;
        removeAll(predicate: (value: T, index: number, array: T[]) => boolean): this;
        replace(
            predicate: (value: T, index: number, array: T[]) => boolean,
            replacement: T | ((value: T, index: number, array: T[]) => T)
        ): this;
        replaceAll(
            predicate: (value: T, index: number, array: T[]) => boolean,
            replacement: T | ((value: T, index: number, array: T[]) => T)
        ): this;
        insertBefore(
            predicate: (value: T, index: number, array: T[]) => boolean,
            ...elements: T[]
        ): this;
        insertAfter(
            predicate: (value: T, index: number, array: T[]) => boolean,
            ...elements: T[]
        ): this;
        sum<U>(fn?: (value: T, index: number, array: T[]) => U): number;
        extend(...items: T[]): this;
        extendArr(items: T[]): this;
        atOr(index: number, defaultValue: T | (() => T)): T;
        collapse(callback: (accumulator: T, current: T) => T): T[];
    }
    interface Iterator<T> {
        toArray(): T[];
    }
    interface Promise<T> {
        thenMap<U>(
            callback: (
                value: T extends Array<infer V> ? V : never,
                index: number,
                array: T extends Array<infer V> ? V[] : never[]
            ) => U
        ): Promise<U[]>;
    }
    interface Map<K, V> {
        getOr(key: K, defaultValue: V | (() => V)): V;
        getSet(key: K, defaultValue: V | (() => V)): V;
        mapUniq<A, B>(callback: (key: K, value: V, map: Map<K, V>) => [A, B]): Map<A, B>;
        map<A, B>(callback: (key: K, value: V, map: Map<K, V>) => [A, B]): Map<A, B[]>;
        mapMkUniq<A, B>(callback: (key: K, value: V, map: Map<K, V>) => [A[], B]): Map<A, B>;
        mapMk<A, B>(callback: (key: K, value: V, map: Map<K, V>) => [A[], B]): Map<A, B[]>;
        entriesWithKeyFilter(filter: (key: K) => boolean): [K, V][];
        toObject(): K extends string | symbol ? Record<K, V> : Record<string, V>;
    }
    interface String {
        getLastNumber(defaultValue?: number | null): number | null;
    }
}

String.prototype.getLastNumber = function (defaultValue: number | null = null): number | null {
    const matches = this.match(/\d+/g);
    if (!matches || matches.length === 0) {
        return defaultValue;
    }
    return Number(matches[matches.length - 1]);
};

Map.prototype.toObject = function <K, V>(this: Map<K, V>): Record<string | symbol, V> {
    const obj: Record<string | symbol, V> = {};
    for (const [key, value] of this.entries()) {
        const objKey = typeof key === 'symbol' ? key : String(key);
        obj[objKey] = value;
    }
    return obj;
};

Map.prototype.entriesWithKeyFilter = function <K, V>(this: Map<K, V>, filter: (key: K) => boolean): [K, V][] {
    const entries: [K, V][] = [];
    if (typeof filter !== 'function') {
        return entries
    }
    for (const [key, value] of this.entries()) {
        if (filter(key)) {
            entries.push([key, value]);
        }
    }
    return entries
};

Array.prototype.collapse = function <T>(this: T[], callback: (accumulator: T, current: T) => T): T[] {
    if (this.length === 0) {
        return this
    }
    // 以第一个元素作为初始值
    let result = this[0];
    // 从第二个元素开始，依次与当前结果进行计算
    for (let i = 1; i < this.length; i++) {
        result = callback(result, this[i]);
    }
    return [result];
};

Array.prototype.group = function <T, U>(this: T[], callback: (value: T, index: number, array: T[]) => U, shouldSort = true): T[][] {
    // 创建一个映射表存储分组结果
    const groups = new Map<U, T[]>();

    // 遍历数组，根据回调函数的返回值进行分组
    this.forEach((item, index, array) => {
        const key = callback(item, index, array);
        // 如果该分组不存在，则创建一个新数组
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        // 将当前元素添加到对应的分组中
        groups.get(key)!.push(item);
    });

    if (shouldSort) {
        // 需要排序时，按键排序后返回
        return Array.from(groups.keys())
            .sort((a, b) => {
                if (typeof a === 'number' && typeof b === 'number') {
                    return a - b;
                }
                return String(a).localeCompare(String(b));
            })
            .map(key => groups.get(key)!);
    } else {
        // 不需要排序时，直接返回Map中的值（保持插入顺序）
        return Array.from(groups.values());
    }
};

Map.prototype.mapUniq = function <K, V, A, B>(this: Map<K, V>, callback: (key: K, value: V, map: Map<K, V>) => [A, B]): Map<A, B> {
    const result = new Map<A, B>();
    for (const [key, value] of this) {
        const [newKey, newValue] = callback(key, value, this);
        result.set(newKey, newValue); // 重复键会被覆盖
    }
    return result;
};

Map.prototype.map = function <K, V, A, B>(this: Map<K, V>, callback: (key: K, value: V, map: Map<K, V>) => [A, B]): Map<A, B[]> {
    const result = new Map<A, B[]>();
    for (const [key, value] of this) {
        const [newKey, newValue] = callback(key, value, this);
        if (result.has(newKey)) {
            result.get(newKey)!.push(newValue);
        } else {
            result.set(newKey, [newValue]);
        }
    }
    return result;
};

Map.prototype.mapMkUniq = function <K, V, A, B>(this: Map<K, V>, callback: (key: K, value: V, map: Map<K, V>) => [A[], B]): Map<A, B> {
    const result = new Map<A, B>();
    for (const [key, value] of this) {
        const [newKeys, newValue] = callback(key, value, this);
        newKeys.forEach(k => {
            result.set(k, newValue); // 重复键会被覆盖
        });
    }
    return result;
};

Map.prototype.mapMk = function <K, V, A, B>(this: Map<K, V>, callback: (key: K, value: V, map: Map<K, V>) => [A[], B]): Map<A, B[]> {
    const result = new Map<A, B[]>();
    for (const [key, value] of this) {
        const [newKeys, newValue] = callback(key, value, this);
        newKeys.forEach(k => {
            if (result.has(k)) {
                result.get(k)!.push(newValue);
            } else {
                result.set(k, [newValue]);
            }
        });
    }
    return result;
};

Array.prototype.atOr = function <T>(this: T[], index: number, defaultValue: T | (() => T)): T {
    // 处理负索引（从数组末尾开始计数）
    const actualIndex = index < 0 ? this.length + index : index;

    // 检查索引是否有效
    if (actualIndex >= 0 && actualIndex < this.length) {
        return this[actualIndex];
    }

    // 返回默认值（如果是函数则执行它）
    return typeof defaultValue === 'function'
        ? (defaultValue as () => T)()
        : defaultValue;
};

Array.prototype.extendArr = function <T>(this: T[], items: T[]): T[] {
    this.push(...items);
    return this;
};

Array.prototype.extend = function <T>(this: T[], ...items: T[]): T[] {
    this.push(...items);
    return this;
};

Array.prototype.sum = function <T, U>(this: T[], fn?: (value: T, index: number, array: T[]) => U): number {
    // 如果没有提供映射函数，默认使用元素本身
    if (typeof fn !== 'function') {
        return this.reduce((acc, value) => {
            // 将元素转换为数字，非数字值将被视为0
            const num = Number(value);
            return acc + (isNaN(num) ? 0 : num);
        }, 0);
    }

    // 如果提供了映射函数，先通过函数处理元素再求和
    return this.reduce((acc, value, index, array) => {
        const result = fn(value, index, array);
        const num = Number(result);
        return acc + (isNaN(num) ? 0 : num);
    }, 0);
};

Array.prototype.insertBefore = function <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    ...elements: T[]
): T[] {
    // 查找第一个匹配的元素索引
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            // 在找到的索引位置插入元素（splice会自动移动后续元素）
            this.splice(i, 0, ...elements);
            break; // 只插入一次
        }
    }
    return this;
};

Array.prototype.insertAfter = function <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    ...elements: T[]
): T[] {
    // 查找第一个匹配的元素索引
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            // 在找到的索引位置后一位插入元素
            this.splice(i + 1, 0, ...elements);
            break; // 只插入一次
        }
    }
    return this;
};

Array.prototype.replace = function <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    replacement: T | ((value: T, index: number, array: T[]) => T)
): T[] {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            // 确定替换值（支持固定值或函数生成值）
            const newValue = typeof replacement === 'function'
                ? (replacement as (value: T, index: number, array: T[]) => T)(this[i], i, this)
                : replacement;

            this[i] = newValue;
            break; // 只替换第一个匹配项
        }
    }
    return this;
};

Array.prototype.replaceAll = function <T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
    replacement: T | ((value: T, index: number, array: T[]) => T)
): T[] {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            // 确定替换值（支持固定值或函数生成值）
            const newValue = typeof replacement === 'function'
                ? (replacement as (value: T, index: number, array: T[]) => T)(this[i], i, this)
                : replacement;

            this[i] = newValue;
        }
    }
    return this;
};

Array.prototype.remove = function <T>(this: T[], predicate: (value: T, index: number, array: T[]) => boolean): T[] {
    // 查找第一个匹配的元素索引
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            this.splice(i, 1); // 删除找到的元素
            break; // 只删除第一个匹配项
        }
    }
    return this; // 支持链式调用
};

Array.prototype.removeAll = function <T>(this: T[], predicate: (value: T, index: number, array: T[]) => boolean): T[] {
    // 从后往前遍历，避免删除元素后索引错乱
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i], i, this)) {
            this.splice(i, 1); // 删除匹配的元素
        }
    }
    return this; // 支持链式调用
};

Array.prototype.swap = function <T>(
    this: T[],
    index1: number | ((value: T, index: number, array: T[]) => boolean),
    index2: number | ((value: T, index: number, array: T[]) => boolean)
): T[] {
    // 解析第一个索引
    const i = typeof index1 === 'function'
        ? this.findIndex(index1)
        : index1;

    // 解析第二个索引
    const j = typeof index2 === 'function'
        ? this.findIndex(index2)
        : index2;

    // 检查索引有效性
    if (
        i < 0 || i >= this.length ||
        j < 0 || j >= this.length ||
        i === j // 索引相同无需交换
    ) {
        return this; // 无效索引时不执行任何操作
    }

    // 执行交换
    const temp = this[i];
    this[i] = this[j];
    this[j] = temp;

    return this; // 支持链式调用
};

Map.prototype.getOr = function <K, V>(this: Map<K, V>, key: K, defaultValue: V | (() => V)): V {
    if (this.has(key)) {
        return this.get(key)!;
    } else {
        return typeof defaultValue === 'function'
            ? (defaultValue as () => V)()
            : defaultValue;
    }
};

Map.prototype.getSet = function <K, V>(this: Map<K, V>, key: K, defaultValue: V | (() => V)): V {
    if (this.has(key)) {
        return this.get(key)!;
    } else {
        const nv = typeof defaultValue === 'function'
            ? (defaultValue as () => V)()
            : defaultValue;
        this.set(key, nv);
        return nv;
    }
};

Array.prototype.mapfilter = function <T, U>(
    this: T[],
    callback: (value: T, index?: number) => U | null | undefined
): U[] {
    const result: U[] = [];
    for (let i = 0; i < this.length; i++) {
        const mapped = callback(this[i], i);
        // 只保留非null和非undefined的值
        if (mapped !== null && mapped !== undefined) {
            result.push(mapped);
        }
    }
    return result;
};

Array.prototype.toMap = function <K, V, T>(this: T[], callback: (value: T, index?: number) => [K, V] | null | undefined): Map<K, V[]> {
    const map = new Map<K, V[]>();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        if (ret?.length !== 2) continue;
        const [key, value] = ret;
        // 检查是否已有该键，如果有则追加到数组，没有则创建新数组
        let arr = map.get(key);
        if (arr == null) {
            arr = [];
            map.set(key, arr);
        }
        arr.push(value);
    }
    return map;
};

Array.prototype.toMapUniq = function <K, V, T>(this: T[], callback: (value: T, index?: number) => [K, V] | null | undefined): Map<K, V> {
    const map = new Map<K, V>();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        if (ret?.length !== 2) continue;
        const [key, value] = ret;
        map.set(key, value);
    }
    return map;
};

Array.prototype.toMapMk = function <K, V, T>(this: T[], callback: (value: T, index?: number) => [K[], V] | null | undefined): Map<K, V[]> {
    const map = new Map<K, V[]>();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        // 检查回调返回值是否有效
        if (!ret || ret.length !== 2 || !Array.isArray(ret[0])) continue;

        const [keys, value] = ret;
        // 遍历键数组，为每个键添加值
        for (const key of keys) {
            let arr = map.get(key);
            if (arr == null) {
                arr = [];
                map.set(key, arr);
            }
            arr.push(value);
        }
    }
    return map;
};

Array.prototype.toMapMkUniq = function <K, V, T>(this: T[], callback: (value: T, index?: number) => [K[], V] | null | undefined): Map<K, V> {
    const map = new Map<K, V>();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        // 检查回调返回值是否有效
        if (!ret || ret.length !== 2 || !Array.isArray(ret[0])) continue;

        const [keys, value] = ret;
        // 遍历键数组，为每个键设置值（后面的会覆盖前面的）
        for (const key of keys) {
            map.set(key, value);
        }
    }
    return map;
};

Array.prototype.toSet = function <K, T>(this: T[], callback: (value: T, index?: number) => K): Set<K> {
    const set = new Set<K>();
    for (let i = 0; i < this.length; i++) {
        const key = callback(this[i], i);
        if (key != null) {
            set.add(key)
        }
    }
    return set;
};

Array.prototype.shuffle = function <T>(this: T[]): T[] {
    const arr = this;
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

Array.prototype.chunks = function <T>(this: T[], size: number): T[][] {
    // 验证输入：检查是否为有效数字且为正数
    if (typeof size !== 'number' || Number.isNaN(size) || size <= 0) {
        return [this]
    }

    const result: T[][] = [];
    // 循环分割数组
    for (let i = 0; i < this.length; i += size) {
        // 从当前索引开始，截取size长度的子数组
        result.push(this.slice(i, i + size));
    }
    return result;
};

Promise.prototype.thenMap = async function <U, V>(
    this: Promise<V[]>,
    callback: (value: V, index: number, array: V[]) => U | Promise<U>
): Promise<U[]> {
    return this.then((array) => {
        // 检查解析结果是否为数组
        if (!Array.isArray(array)) {
            return Promise.reject(new Error('Promise resolved value is not an array'));
        }
        // 对数组中的每个元素应用回调函数，得到Promise数组
        const promises = array.map(callback);
        // 等待所有Promise完成并返回结果数组
        return Promise.all(promises);
    });
};

Object.getPrototypeOf([][Symbol.iterator]()).toArray = function <T>(this: Iterator<T>): T[] {
    const result: T[] = [];
    let next;
    // 遍历迭代器并收集所有值
    while (!(next = this.next()).done) {
        result.push(next.value);
    }
    return result;
};

// 3. 扩展数组原型
Array.prototype.asyncMap = async function <T, U, K = Awaited<U>>(
    this: T[],
    callback: (value: T, index: number) => U | Promise<U>,
    postMap?: (value: Awaited<U>, index: number) => K | Promise<K>
): Promise<Awaited<K>[]> {
    const promises: Promise<K>[] = [];
    let index = 0;

    for await (const value of this) {
        // 捕获当前索引（避免闭包中index值变化的问题）
        const currentIndex = index++;
        // 在单个Promise链中完成callback -> postMap的处理
        if (postMap == null) {
            const promise = Promise.resolve(callback(value, currentIndex) as K)
            promises.push(promise);
        } else {
            const promise = Promise.resolve(callback(value, currentIndex))
                .then(result => postMap(result, currentIndex));
            promises.push(promise);
        }
    }
    // 只需一次Promise.all即可获得最终结果
    return Promise.all(promises);
};

// 添加uniq方法到数组原型
Array.prototype.uniq = function <T, V = T>(
    this: T[],
    fn?: (value: T, index: number) => V
): T[] {
    const seen = new Set<V>();
    const result: T[] = [];
    for (let i = 0; i < this.length; i++) {
        const item = this[i];
        // 获取用于比较的值，如果没有提供函数则使用元素本身
        const compareValue = fn ? fn(item, i) : item as unknown as V;
        // 检查是否已存在（使用Set的has方法，内部使用===比较）
        if (!seen.has(compareValue)) {
            seen.add(compareValue);
            result.push(item);
        }
    }
    return result;
};
