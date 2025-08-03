export function into<U>(fn: () => U) {
    return fn();
}

declare global {
    interface Array<T> {
        asyncMap<U, K = Awaited<U>>(
            callback: (value: T, index: number) => U | Promise<U>,
            postMap?: (value: Awaited<U>, index: number) => K | Promise<K>
        ): Promise<Awaited<K>[]>;

        uniq<V = T>(
            fn?: (value: T, index: number) => V
        ): T[];
    }
}

async function asyncMapImpl<T, U, K = Awaited<U>>(
    iterable: AsyncIterable<T> | Iterable<T | Promise<T>>,
    callback: (value: T, index: number) => U | Promise<U>,
    postMap: (value: Awaited<U>, index: number) => K | Promise<K> = (x) => x as unknown as K,
): Promise<Awaited<K>[]> {
    const promises: Promise<K>[] = [];
    let index = 0;

    for await (const value of iterable) {
        // 捕获当前索引（避免闭包中index值变化的问题）
        const currentIndex = index++;
        // 在单个Promise链中完成callback -> postMap的处理
        const promise = Promise.resolve(callback(value, currentIndex))
            .then(result => postMap(result, currentIndex));
        promises.push(promise);
    }

    // 只需一次Promise.all即可获得最终结果
    return Promise.all(promises);
}

function uniqImpl<T, V = T>(
    array: T[],
    fn?: (value: T, index: number) => V
): T[] {
    const seen = new Set<V>();
    const result: T[] = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        // 获取用于比较的值，如果没有提供函数则使用元素本身
        const compareValue = fn ? fn(item, i) : item as unknown as V;
        // 检查是否已存在（使用Set的has方法，内部使用===比较）
        if (!seen.has(compareValue)) {
            seen.add(compareValue);
            result.push(item);
        }
    }
    return result;
}

// 3. 扩展数组原型
Array.prototype.asyncMap = async function <T, U, K = Awaited<U>>(
    this: T[],
    callback: (value: T, index: number) => U | Promise<U>,
    postMap?: (value: Awaited<U>, index: number) => K | Promise<K>
): Promise<Awaited<K>[]> {
    return asyncMapImpl(this, callback, postMap);
};

// 添加uniq方法到数组原型
Array.prototype.uniq = function <T, V = T>(
    this: T[],
    fn?: (value: T, index: number) => V
): T[] {
    return uniqImpl(this, fn);
};

export { };
