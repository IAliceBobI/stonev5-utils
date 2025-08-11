export function into<U>(fn: () => U) {
    return fn();
}

declare global {
    interface Array<T> {
        asyncMap<U, K = Awaited<U>>(
            callback: (value: T, index: number) => U | Promise<U>,
            postMap?: (value: Awaited<U>, index: number) => K | Promise<K>
        ): Promise<Awaited<K>[]>;
        uniq<V = T>(fn?: (value: T, index: number) => V): T[];
        chunks(size: number): T[][];
        shuffle(): T[];
        toMap<K, V>(callback: (value: T, index?: number) => [K, V]): Map<K, V[]>;
        toSet<K>(callback: (value: T, index?: number) => K): Set<K>;
        mapfilter<U>(callback: (value: T, index?: number) => U | null | undefined): U[];
    }
    interface ArrayIterator<T> {
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
}

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
        throw new Error('Chunk size must be a positive number');
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

Object.getPrototypeOf([][Symbol.iterator]()).toArray = function <T>(this: ArrayIterator<T>): T[] {
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
