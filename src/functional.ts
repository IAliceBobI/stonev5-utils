export function into<U>(fn: () => U) {
    return fn();
}

// 1. 扩展类型定义
declare global {
    interface Array<T> {
        asyncMap<U, K = Awaited<U>>(
            callback: (value: T, index: number) => U | Promise<U>,
            postMap?: (value: Awaited<U>, index: number) => K | Promise<K>
        ): Promise<Awaited<K>[]>;
    }
}

// 2. 核心实现
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

// 3. 扩展数组原型
Array.prototype.asyncMap = async function <T, U, K = Awaited<U>>(
    this: T[],
    callback: (value: T, index: number) => U | Promise<U>,
    postMap?: (value: Awaited<U>, index: number) => K | Promise<K>
): Promise<Awaited<K>[]> {
    return asyncMapImpl(this, callback, postMap);
};



