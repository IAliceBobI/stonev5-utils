"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinArray = joinArray;
exports.arrayDeleteFromLeft = arrayDeleteFromLeft;
exports.arrayRemoveBy = arrayRemoveBy;
exports.pushNotNull = pushNotNull;
exports.removeFromArr = removeFromArr;
exports.pushUniq = pushUniq;
exports.pushUniqBy = pushUniqBy;
exports.pushReplaceBy = pushReplaceBy;
exports.push = push;
exports.count = count;
exports.getRange = getRange;
exports.arrayRemove = arrayRemove;
exports.sortedMap = sortedMap;
exports.divideArrayIntoParts = divideArrayIntoParts;
exports.chunks = chunks;
exports.shuffleArray = shuffleArray;
exports.uniqueFilter = uniqueFilter;
exports.removeXAndAfter = removeXAndAfter;
exports.removeAfter = removeAfter;
function joinArray(array, factory) {
    if (!array)
        return [];
    return array.flatMap((value, index, arr) => {
        if (index === arr.length - 1) {
            return [value];
        }
        return [value, factory()];
    });
}
function arrayDeleteFromLeft(list, keep) {
    for (let i = 0; i < list.length; i++) {
        if (!keep(list[i], i, list)) {
            list.splice(i, 1);
            i--;
        }
    }
    return list;
}
function arrayRemoveBy(list, remove) {
    for (let i = 0; i < list.length; i++) {
        if (remove(list[i], i, list)) {
            list.splice(i, 1);
            i--;
        }
    }
    return list;
}
function pushNotNull(arr, ...items) {
    if (!arr)
        arr = [];
    if (items != null) {
        for (const i of items) {
            if (i != null) {
                arr.push(i);
            }
        }
    }
    return arr;
}
function removeFromArr(arr, ...items) {
    if (!arr)
        arr = [];
    for (let i = 0; i < items.length; i++) {
        // 由于 items.at(i) 可能返回 undefined，而 indexOf 方法期望的参数类型是 T，因此需要先检查是否为 undefined
        const item = items.at(i);
        const idx = item != undefined ? arr.indexOf(item) : -1;
        if (idx >= 0) {
            arr.splice(idx, 1);
            i--;
        }
    }
    return arr;
}
function pushUniq(arr, ...items) {
    if (!arr)
        arr = [];
    for (const i of items) {
        const idx = arr.indexOf(i);
        if (idx >= 0)
            continue;
        arr.push(i);
    }
    return arr;
}
function pushUniqBy(arr, item, by) {
    if (!arr)
        arr = [];
    if (arr.find(v => by(v) === by(item)) == null) {
        arr.push(item);
    }
    return arr;
}
function pushReplaceBy(arr, item, by) {
    if (!arr)
        arr = [];
    const idx = arr.findIndex(v => by(v) === by(item));
    if (idx >= 0) {
        arr[idx] = item;
    }
    else {
        arr.push(item);
    }
    return arr;
}
function push(arr, ...items) {
    if (!arr)
        arr = [];
    arr.push(...items);
    return arr;
}
function* count(end) {
    for (let i = 0; i < end; i++) {
        yield i;
    }
}
function* getRange(start, end) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}
function arrayRemove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}
function sortedMap(map, compareFn) {
    return new Map([...map.entries()].sort(compareFn));
}
function divideArrayIntoParts(array, n) {
    n = Math.ceil(array.length / n);
    return chunks(array, n);
}
function chunks(array, n) {
    const newArr = [];
    for (let i = 0; i < array.length; i += n) {
        const part = array.slice(i, i + n);
        if (part.length > 0)
            newArr.push(part);
    }
    return newArr;
}
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
function uniqueFilter(keySelector) {
    const seen = new Set();
    return (item) => {
        const key = keySelector(item);
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    };
}
;
function removeXAndAfter(arr, find) {
    const idx = arr.findIndex(find);
    if (idx !== -1) {
        arr.splice(idx, Number.MAX_SAFE_INTEGER);
    }
}
function removeAfter(arr, find) {
    const idx = arr.findIndex(find);
    if (idx !== -1) {
        arr.splice(idx + 1, Number.MAX_SAFE_INTEGER);
    }
}
