import { Md5 } from "ts-md5";

export function getMd5(str: string) {
    const md5 = new Md5();
    md5.appendStr(str);
    return md5.end()?.toString() ?? "";
}

