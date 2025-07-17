import { strCode } from "./string";

export function dom2div(dom: string) {
    const div = document.createElement("div") as HTMLElement;
    if (!dom) return div;
    div.innerHTML = dom;
    return div.firstElementChild as HTMLElement;
}

export function oneDiv(...divs: HTMLElement[]) {
    const div = document.createElement("div") as HTMLElement;
    divs?.forEach(d => div.appendChild(d))
    return div
}


export function removeDivFuckChar8203(div: HTMLElement) {
    removeDivFuckChar(div, "8203")
}

export function removeDivFuckChar(div: HTMLElement, c: string) {
    let flag = true;
    let i = 10
    while (flag && --i > 0) {
        flag = false;
        for (const e of div.childNodes) {
            if (strCode(e.textContent ?? "") == c) {
                flag = true;
                e?.parentNode?.removeChild(e)
            }
        }
    }
}