"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.into = into;
exports.objectToMap = objectToMap;
exports.objectEntriesWithKeyFilter = objectEntriesWithKeyFilter;
function into(fn) {
    return fn();
}
function objectToMap(obj) {
    const map = new Map();
    // 处理字符串键
    Object.entries(obj).forEach(([key, value]) => {
        map.set(key, value);
    });
    return map;
}
;
function objectEntriesWithKeyFilter(obj, filter) {
    const entries = [];
    if (typeof filter !== 'function') {
        return entries;
    }
    // 处理字符串键
    Object.entries(obj).forEach(([key, value]) => {
        if (filter(key)) {
            entries.push([key, value]);
        }
    });
    return entries;
}
;
Array.prototype.groupedParallelExecute = async function (groupCount, taskHandler) {
    // 边界情况处理：空数组直接返回
    if (this.length === 0) {
        return [];
    }
    // 确保分组数量合理
    const actualGroupCount = Math.max(1, Math.min(groupCount, this.length));
    // 创建分组
    const groups = Array.from({ length: actualGroupCount }, () => []);
    // 分配任务索引到各个小组（只保存索引，避免数据复制）
    this.forEach((_, index) => {
        const groupIndex = index % actualGroupCount;
        groups[groupIndex].push(index);
    });
    // 存储结果，保持原始顺序
    const results = new Array(this.length);
    // 定义每个小组的执行函数（串行执行小组内任务）
    const executeGroup = async (group) => {
        for (const index of group) {
            try {
                const result = await taskHandler(this[index], index, this);
                results[index] = result;
            }
            catch (error) {
                // 确保错误能够正确传播
                throw error;
            }
        }
    };
    // 并发执行所有小组
    await Promise.all(groups.map(group => executeGroup(group)));
    return results;
};
Array.prototype.executeSequentially = async function () {
    const results = [];
    // 遍历数组中的每个任务并按顺序执行
    for (const task of this) {
        if (typeof task !== 'function') {
            throw new Error('数组元素必须是返回Promise的函数');
        }
        try {
            // 等待当前任务完成后再执行下一个
            const result = await task();
            results.push(result);
        }
        catch (error) {
            // 可以根据需要决定是继续执行还是停止
            console.error('任务执行出错:', error);
            // 如果希望出错后停止，可以在这里抛出错误
            // throw error;
        }
    }
    return results;
};
Set.prototype.addAll = function (elements) {
    for (const element of elements) {
        this.add(element);
    }
    return this;
};
Array.prototype.findOrLesser = function (predicate) {
    // 空数组直接返回undefined
    if (this.length === 0)
        return undefined;
    let low = 0;
    let high = this.length - 1;
    let result = undefined;
    // 使用二分查找提高效率
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const comparison = predicate(this[mid]);
        if (comparison === 0) {
            // 找到匹配元素
            return this[mid];
        }
        else if (comparison < 0) {
            // 当前元素小于目标，可能是候选结果
            result = this[mid];
            low = mid + 1;
        }
        else {
            // 当前元素大于目标，缩小查找范围
            high = mid - 1;
        }
    }
    // 返回最后找到的小于目标的元素
    return result;
};
String.prototype.getLastNumber = function (defaultValue = null) {
    const matches = this.match(/\d+/g);
    if (!matches || matches.length === 0) {
        return defaultValue;
    }
    return Number(matches[matches.length - 1]);
};
Map.prototype.toObject = function () {
    const obj = {};
    for (const [key, value] of this.entries()) {
        const objKey = typeof key === 'symbol' ? key : String(key);
        obj[objKey] = value;
    }
    return obj;
};
Map.prototype.entriesWithKeyFilter = function (filter) {
    const entries = [];
    if (typeof filter !== 'function') {
        return entries;
    }
    for (const [key, value] of this.entries()) {
        if (filter(key)) {
            entries.push([key, value]);
        }
    }
    return entries;
};
Array.prototype.collapse = function (callback) {
    if (this.length === 0) {
        return this;
    }
    // 以第一个元素作为初始值
    let result = this[0];
    // 从第二个元素开始，依次与当前结果进行计算
    for (let i = 1; i < this.length; i++) {
        result = callback(result, this[i]);
    }
    return [result];
};
Array.prototype.group = function (callback, shouldSort = true) {
    // 创建一个映射表存储分组结果
    const groups = new Map();
    // 遍历数组，根据回调函数的返回值进行分组
    this.forEach((item, index, array) => {
        const key = callback(item, index, array);
        // 如果该分组不存在，则创建一个新数组
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        // 将当前元素添加到对应的分组中
        groups.get(key).push(item);
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
            .map(key => groups.get(key));
    }
    else {
        // 不需要排序时，直接返回Map中的值（保持插入顺序）
        return Array.from(groups.values());
    }
};
Map.prototype.mapUniq = function (callback) {
    const result = new Map();
    for (const [key, value] of this) {
        const [newKey, newValue] = callback(key, value, this);
        result.set(newKey, newValue); // 重复键会被覆盖
    }
    return result;
};
Map.prototype.map = function (callback) {
    const result = new Map();
    for (const [key, value] of this) {
        const [newKey, newValue] = callback(key, value, this);
        if (result.has(newKey)) {
            result.get(newKey).push(newValue);
        }
        else {
            result.set(newKey, [newValue]);
        }
    }
    return result;
};
Map.prototype.mapMkUniq = function (callback) {
    const result = new Map();
    for (const [key, value] of this) {
        const [newKeys, newValue] = callback(key, value, this);
        newKeys.forEach(k => {
            result.set(k, newValue); // 重复键会被覆盖
        });
    }
    return result;
};
Map.prototype.mapMk = function (callback) {
    const result = new Map();
    for (const [key, value] of this) {
        const [newKeys, newValue] = callback(key, value, this);
        newKeys.forEach(k => {
            if (result.has(k)) {
                result.get(k).push(newValue);
            }
            else {
                result.set(k, [newValue]);
            }
        });
    }
    return result;
};
Array.prototype.atOr = function (index, defaultValue) {
    // 处理负索引（从数组末尾开始计数）
    const actualIndex = index < 0 ? this.length + index : index;
    // 检查索引是否有效
    if (actualIndex >= 0 && actualIndex < this.length) {
        return this[actualIndex];
    }
    // 返回默认值（如果是函数则执行它）
    return typeof defaultValue === 'function'
        ? defaultValue()
        : defaultValue;
};
Array.prototype.extendArr = function (items) {
    this.push(...items);
    return this;
};
Array.prototype.extend = function (...items) {
    this.push(...items);
    return this;
};
Array.prototype.sum = function (fn) {
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
Array.prototype.insertBefore = function (predicate, ...elements) {
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
Array.prototype.insertAfter = function (predicate, ...elements) {
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
Array.prototype.replace = function (predicate, replacement) {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            // 确定替换值（支持固定值或函数生成值）
            const newValue = typeof replacement === 'function'
                ? replacement(this[i], i, this)
                : replacement;
            this[i] = newValue;
            break; // 只替换第一个匹配项
        }
    }
    return this;
};
Array.prototype.replaceAll = function (predicate, replacement) {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            // 确定替换值（支持固定值或函数生成值）
            const newValue = typeof replacement === 'function'
                ? replacement(this[i], i, this)
                : replacement;
            this[i] = newValue;
        }
    }
    return this;
};
Array.prototype.remove = function (predicate) {
    // 查找第一个匹配的元素索引
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            this.splice(i, 1); // 删除找到的元素
            break; // 只删除第一个匹配项
        }
    }
    return this; // 支持链式调用
};
Array.prototype.removeAll = function (predicate) {
    // 从后往前遍历，避免删除元素后索引错乱
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i], i, this)) {
            this.splice(i, 1); // 删除匹配的元素
        }
    }
    return this; // 支持链式调用
};
Array.prototype.swap = function (index1, index2) {
    // 解析第一个索引
    const i = typeof index1 === 'function'
        ? this.findIndex(index1)
        : index1;
    // 解析第二个索引
    const j = typeof index2 === 'function'
        ? this.findIndex(index2)
        : index2;
    // 检查索引有效性
    if (i < 0 || i >= this.length ||
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
Map.prototype.getOr = function (key, defaultValue) {
    if (this.has(key)) {
        return this.get(key);
    }
    else {
        return typeof defaultValue === 'function'
            ? defaultValue()
            : defaultValue;
    }
};
Map.prototype.getSet = function (key, defaultValue) {
    if (this.has(key)) {
        return this.get(key);
    }
    else {
        const nv = typeof defaultValue === 'function'
            ? defaultValue()
            : defaultValue;
        this.set(key, nv);
        return nv;
    }
};
Array.prototype.mapfilter = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        const mapped = callback(this[i], i);
        // 只保留非null和非undefined的值
        if (mapped !== null && mapped !== undefined) {
            result.push(mapped);
        }
    }
    return result;
};
Array.prototype.toMap = function (callback) {
    const map = new Map();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        if (ret?.length !== 2)
            continue;
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
Array.prototype.toMapUniq = function (callback) {
    const map = new Map();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        if (ret?.length !== 2)
            continue;
        const [key, value] = ret;
        map.set(key, value);
    }
    return map;
};
Array.prototype.toMapMk = function (callback) {
    const map = new Map();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        // 检查回调返回值是否有效
        if (!ret || ret.length !== 2 || !Array.isArray(ret[0]))
            continue;
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
Array.prototype.toMapMkUniq = function (callback) {
    const map = new Map();
    for (let i = 0; i < this.length; i++) {
        const ret = callback(this[i], i);
        // 检查回调返回值是否有效
        if (!ret || ret.length !== 2 || !Array.isArray(ret[0]))
            continue;
        const [keys, value] = ret;
        // 遍历键数组，为每个键设置值（后面的会覆盖前面的）
        for (const key of keys) {
            map.set(key, value);
        }
    }
    return map;
};
Array.prototype.toSet = function (callback) {
    const set = new Set();
    for (let i = 0; i < this.length; i++) {
        const key = callback(this[i], i);
        if (key != null) {
            set.add(key);
        }
    }
    return set;
};
Array.prototype.shuffle = function () {
    const arr = this;
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};
Array.prototype.chunks = function (size) {
    // 验证输入：检查是否为有效数字且为正数
    if (typeof size !== 'number' || Number.isNaN(size) || size <= 0) {
        return [this];
    }
    const result = [];
    // 循环分割数组
    for (let i = 0; i < this.length; i += size) {
        // 从当前索引开始，截取size长度的子数组
        result.push(this.slice(i, i + size));
    }
    return result;
};
Promise.prototype.thenMap = async function (callback) {
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
Object.getPrototypeOf([][Symbol.iterator]()).toArray = function () {
    const result = [];
    let next;
    // 遍历迭代器并收集所有值
    while (!(next = this.next()).done) {
        result.push(next.value);
    }
    return result;
};
// 3. 扩展数组原型
Array.prototype.asyncMap = async function (callback, postMap) {
    const promises = [];
    let index = 0;
    for await (const value of this) {
        // 捕获当前索引（避免闭包中index值变化的问题）
        const currentIndex = index++;
        // 在单个Promise链中完成callback -> postMap的处理
        if (postMap == null) {
            const promise = Promise.resolve(callback(value, currentIndex));
            promises.push(promise);
        }
        else {
            const promise = Promise.resolve(callback(value, currentIndex))
                .then(result => postMap(result, currentIndex));
            promises.push(promise);
        }
    }
    // 只需一次Promise.all即可获得最终结果
    return Promise.all(promises);
};
// 添加uniq方法到数组原型
Array.prototype.uniq = function (fn) {
    const seen = new Set();
    const result = [];
    for (let i = 0; i < this.length; i++) {
        const item = this[i];
        // 获取用于比较的值，如果没有提供函数则使用元素本身
        const compareValue = fn ? fn(item, i) : item;
        // 检查是否已存在（使用Set的has方法，内部使用===比较）
        if (!seen.has(compareValue)) {
            seen.add(compareValue);
            result.push(item);
        }
    }
    return result;
};
