"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pmapNull = pmapNull;
exports.pmap = pmap;
exports.pmapNullVO = pmapNullVO;
exports.pmapVO = pmapVO;
async function pmapNull(list, fn) {
    const a = await Promise.all(list.map(i => fn(i)));
    return list.map((i, idx) => { return { k: i, v: a[idx] }; });
}
async function pmap(list, fn) {
    return pmapNull(list, fn).then(l => l.filter(({ v }) => v != null));
}
async function pmapNullVO(list, fn) {
    return Promise.all(list.map(i => fn(i)));
}
async function pmapVO(list, fn) {
    return pmapNullVO(list, fn).then(l => l.filter(v => v != null));
}
