

export async function pmapNull<A, T>(list: Array<A>, fn: (a: A) => Promise<T>) {
    const a = await Promise.all(list.map(i => fn(i)))
    return list.map((i, idx) => { return { k: i, v: a[idx] }; })
}


export async function pmap<A, T>(list: Array<A>, fn: (a: A) => Promise<T | null | undefined>) {
    return pmapNull(list, fn).then(l => l.filter(({ v }) => v != null));
}

export async function pmapNullVO<A, T>(list: Array<A>, fn: (a: A) => Promise<T>) {
    return Promise.all(list.map(i => fn(i)))
}

export async function pmapVO<A, T>(list: Array<A>, fn: (a: A) => Promise<T | null | undefined>) {
    return pmapNullVO(list, fn).then(l => l.filter(v => v != null));
}
