"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAllIf = replaceAllIf;
exports.notEmptyStrDo = notEmptyStrDo;
exports.stringToNumber = stringToNumber;
exports.joinByComma = joinByComma;
exports.htmlEscape = htmlEscape;
exports.htmlUnescape = htmlUnescape;
exports.replaceAll = replaceAll;
exports.removeInvisibleChars = removeInvisibleChars;
exports.toJSON = toJSON;
exports.dir = dir;
exports.padStart = padStart;
exports.splitByMiddle = splitByMiddle;
exports.sanitizePathSegment = sanitizePathSegment;
exports.strCharCode = strCharCode;
exports.strCode = strCode;
function replaceAllIf(txt, old, New) {
    if (txt.endsWith(old))
        return txt.replaceAll(old, New);
    return txt;
}
function notEmptyStrDo(s, cb) {
    s = s?.trim();
    if (s)
        cb(s);
}
function stringToNumber(str) {
    const num = Number(str);
    return isNaN(num) ? 0 : num;
}
function joinByComma(all, id) {
    if (all) {
        const a = all.split(",");
        a.push(id);
        return [...(new Set(a)).values()].join(",");
    }
    return id;
}
function htmlEscape(str) {
    return str.replace(/&/g, "&amp;") // 转义 &
        .replace(/</g, "&lt;") // 转义 <
        .replace(/>/g, "&gt;") // 转义 >
        .replace(/"/g, "&quot;") // 转义 双引号
        .replace(/'/g, "&#039;"); // 转义 单引号
}
function htmlUnescape(str) {
    return str.replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#039;/g, "'");
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
}
function removeInvisibleChars(str, trim = false) {
    // 使用正则表达式匹配所有不可见字符并替换为空字符串
    if (trim) {
        return str.replace(/^[\s\u200B-\u200D\uFEFF]+|[\s\u200B-\u200D\uFEFF]+$/g, '');
    }
    else {
        return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
    }
}
// 为函数添加返回类型批注，根据函数逻辑，返回值可能是任意类型，所以使用 any 类型
function toJSON(obj, maxDepth = 10, currentDepth = 0, seen = new Set()) {
    if (seen.has(obj)) {
        return '[Circular]';
    }
    seen.add(obj);
    if (currentDepth >= maxDepth) {
        return '[MaxDepthReached]';
    }
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => toJSON(item, maxDepth, currentDepth + 1, seen));
    }
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // 为 result 定义一个更合适的类型，使用 Record<string, any> 允许使用任意字符串作为键
            const result = {};
            result[key] = toJSON(obj[key], maxDepth, currentDepth + 1, seen);
        }
    }
    return result;
}
function dir(path) {
    const parts = path.split("/");
    const file = parts.pop();
    return [parts.join("/"), file];
}
function padStart(input, targetLength, padString) {
    const inputLength = input.length;
    if (inputLength >= targetLength) {
        return input;
    }
    const paddingLength = targetLength - inputLength;
    const padding = padString.repeat(Math.ceil(paddingLength / padString.length)).slice(0, paddingLength);
    return padding + input;
}
function splitByMiddle(str) {
    const middleIndex = Math.floor(str.length / 2);
    const part1 = str.substring(0, middleIndex);
    const part2 = str.substring(middleIndex);
    return [part1, part2];
}
const ILLEGAL_CHARS_REGEX = /[\x00\/\\:*?"<>|]/g; // \x00 代表空字符 [5](@ref)[4](@ref)
function sanitizePathSegment(segment) {
    // 保留 Windows 驱动器标识（如 C:）
    // if (segment.length === 2 && segment[1] === ':') {
    //     return segment;
    // }
    return segment.replace(ILLEGAL_CHARS_REGEX, '_'); // 替换为下划线
}
function strCharCode(str) {
    let codes = [];
    for (let i = 0; i < str.length; i++) {
        codes.push(`${str.charCodeAt(i)}${str.charAt(i)}`);
    }
    return codes.join(" ");
}
function strCode(str) {
    let codes = [];
    for (let i = 0; i < str.length; i++) {
        codes.push(str.charCodeAt(i));
    }
    return codes.join("");
}
