export function replaceAllIf(txt: string, old: string, New: string) {
    if (txt.endsWith(old))
        return txt.replaceAll(old, New)
    return txt;
}

export function notEmptyStrDo(s: string, cb: (s: string) => void) {
    s = s?.trim()
    if (s) cb(s);
}

export function stringToNumber(str: string) {
    const num = Number(str);
    return isNaN(num) ? 0 : num;
}

export function joinByComma(all: string, id: string) {
    if (all) {
        const a = all.split(",")
        a.push(id)
        return [...(new Set(a)).values()].join(",")
    }
    return id
}

export function htmlEscape(str: string) {
    return str.replace(/&/g, "&amp;")  // 转义 &
        .replace(/</g, "&lt;")  // 转义 <
        .replace(/>/g, "&gt;")  // 转义 >
        .replace(/"/g, "&quot;")  // 转义 双引号
        .replace(/'/g, "&#039;"); // 转义 单引号
}

export function htmlUnescape(str: string) {
    return str.replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#039;/g, "'");
}

export function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(find, "g"), replace);
}

export function removeInvisibleChars(str: string, trim = false): string {
    // 使用正则表达式匹配所有不可见字符并替换为空字符串
    if (trim) {
        return str.replace(/^[\s\u200B-\u200D\uFEFF]+|[\s\u200B-\u200D\uFEFF]+$/g, '');
    } else {
        return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
    }
}

// 为函数添加返回类型批注，根据函数逻辑，返回值可能是任意类型，所以使用 any 类型
export function toJSON(obj: any, maxDepth = 10, currentDepth = 0, seen = new Set()): any {
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
            const result: Record<string, any> = {};
            result[key] = toJSON(obj[key], maxDepth, currentDepth + 1, seen);
        }
    }
    return result;
}

export function dir(path: string) {
    const parts = path.split("/");
    const file = parts.pop();
    return [parts.join("/"), file];
}

export function padStart(input: string, targetLength: number, padString: string): string {
    const inputLength = input.length;
    if (inputLength >= targetLength) {
        return input;
    }
    const paddingLength = targetLength - inputLength;
    const padding = padString.repeat(Math.ceil(paddingLength / padString.length)).slice(0, paddingLength);
    return padding + input;
}

export function splitByMiddle(str: string): [string, string] {
    const middleIndex = Math.floor(str.length / 2);
    const part1 = str.substring(0, middleIndex);
    const part2 = str.substring(middleIndex);
    return [part1, part2];
}

const ILLEGAL_CHARS_REGEX = /[\x00\/\\:*?"<>|]/g;  // \x00 代表空字符 [5](@ref)[4](@ref)

export function sanitizePathSegment(segment: string): string {
    // 保留 Windows 驱动器标识（如 C:）
    // if (segment.length === 2 && segment[1] === ':') {
    //     return segment;
    // }
    return segment.replace(ILLEGAL_CHARS_REGEX, '_'); // 替换为下划线
}

