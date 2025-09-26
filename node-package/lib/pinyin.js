"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinyinLongShort = pinyinLongShort;
exports.getPinyin = getPinyin;
exports.pinyinAll = pinyinAll;
const pinyin_pro_1 = require("pinyin-pro");
/**
 * 转换中文为拼音的长音和短音形式
 * @param name - 中文名称
 * @returns 包含长音和短音的对象
 * @requires pinyin-pro - 需安装依赖: npm install pinyin-pro
 */
function pinyinLongShort(name) {
    let long = "";
    let short = "";
    if (name) {
        const pyLong = (0, pinyin_pro_1.pinyin)(name, { toneType: "none", type: "array" });
        long = pyLong.join("");
        short = pyLong.map(i => i.charAt(0)).join("");
    }
    return { short, long };
}
/**
 * 获取中文标题的拼音形式
 * @param title - 中文标题
 * @returns 包含长音和短音的对象
 * @requires pinyin-pro - 需安装依赖: npm install pinyin-pro
 */
function getPinyin(title) {
    if (!title)
        return { short: "", long: "" };
    const pyLong = (0, pinyin_pro_1.pinyin)(title, { toneType: "none", type: "array" });
    const long = pyLong.join("");
    const short = pyLong.map(i => i.charAt(0)).join("");
    return { short, long };
}
/**
 * 获取中文名称的所有可能拼音组合
 * @param name - 中文名称
 * @param sep - 拼音分隔符
 * @returns 包含各种拼音组合的对象
 * @requires pinyin-pro - 需安装依赖: npm install pinyin-pro
 */
function pinyinAll(name, sep = "/") {
    if (!name)
        return {};
    const pyLong = (0, pinyin_pro_1.pinyin)(name, { toneType: "symbol", multiple: true, type: "all" });
    const pys = pyLong
        .filter(i => {
        i.origin = i.origin ?? "";
        i.origin = i.origin.trim();
        return i.origin.length > 0;
    })
        .map(i => {
        const pys = i.polyphonic.filter(j => j != i.pinyin);
        pys.splice(0, 0, i.pinyin);
        return { origin: i.origin, pys };
    })
        .filter(({ pys }) => pys.filter(i => !!i).length > 0);
    const space = "     ";
    const allPY = pys.map(({ origin, pys }) => {
        return `${origin}${pys.join(sep)}`;
    }).join(space);
    const onePY = pys.map(({ origin, pys }) => {
        return `${origin}${pys[0]}`;
    }).join(space);
    const pyOnly = pys.map(({ pys }) => {
        return pys[0];
    }).join(space);
    const originOnly = pys.map(({ origin }) => {
        return origin;
    }).join(space);
    return { allPY, onePY, pyOnly, originOnly };
}
