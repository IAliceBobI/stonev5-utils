import { v4 as uuid } from "uuid";

export function newID() {
    return "ID" + uuid().replace(/-/g, "");
}

