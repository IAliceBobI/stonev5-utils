"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newID = newID;
const uuid_1 = require("uuid");
function newID() {
    return "ID" + (0, uuid_1.v4)().replace(/-/g, "");
}
