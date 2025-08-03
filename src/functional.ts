export function into<U>(fn: () => U) {
    return fn();
}

export async function awaitMap<T, U, K = Awaited<U>>(
    iterable: AsyncIterable<T> | Iterable<T | Promise<T>>,
    callback: (value: T, index: number) => U | Promise<U>,
    postMap: (value: Awaited<U>, index: number) => K | Promise<K> = (x) => x as unknown as K,
): Promise<Awaited<K>[]> {
    const promises: Promise<K>[] = [];
    let index = 0;
    for await (const value of iterable) {
        // 捕获当前索引（避免闭包中index值变化的问题）
        const currentIndex = index++;
        const promise = Promise.resolve(callback(value, currentIndex))
            .then(result => postMap(result, currentIndex));
        promises.push(promise);
    }
    return Promise.all(promises);
}
