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


export function removeHTMLFuckChar8203(div: HTMLElement) {
    removeHTMLFuckChar(div, "8203")
}

export function removeHTMLFuckChar(div: HTMLElement, c: string, maxIter = 10) {
    let flag = true;
    while (flag && --maxIter > 0) {
        flag = false;
        for (const e of div.childNodes) {
            if (strCode(e.textContent ?? "") == c) {
                flag = true;
                e?.parentNode?.removeChild(e)
            }
        }
    }
}