"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dom2div = dom2div;
exports.oneDiv = oneDiv;
exports.removeHTMLFuckChar8203 = removeHTMLFuckChar8203;
exports.removeHTMLFuckChar = removeHTMLFuckChar;
const string_1 = require("./string");
function dom2div(dom) {
    const div = document.createElement("div");
    if (!dom)
        return div;
    div.innerHTML = dom;
    return div.firstElementChild;
}
function oneDiv(...divs) {
    const div = document.createElement("div");
    divs?.forEach(d => div.appendChild(d));
    return div;
}
function removeHTMLFuckChar8203(div, maxIter = 10) {
    removeHTMLFuckChar(div, "8203", maxIter);
}
function removeHTMLFuckChar(div, c, maxIter = 10) {
    let flag = true;
    while (flag && --maxIter > 0) {
        flag = false;
        for (const e of div.childNodes) {
            if ((0, string_1.strCode)(e.textContent ?? "") == c) {
                flag = true;
                e?.parentNode?.removeChild(e);
            }
        }
    }
}
