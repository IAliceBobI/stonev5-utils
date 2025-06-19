export function dom2div(dom: string) {
    const div = document.createElement("div") as HTMLElement;
    if (!dom) return div;
    div.innerHTML = dom;
    return div.firstElementChild as HTMLElement;
}

