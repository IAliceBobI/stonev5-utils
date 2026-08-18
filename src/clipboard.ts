export async function copy2clipboard(text: string) {
    return navigator.clipboard.writeText(text)
}
