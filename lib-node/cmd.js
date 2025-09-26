"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCmd = runCmd;
async function runCmd(cmd) {
    if (typeof require !== 'function' || typeof process === 'undefined' || !process.versions?.node) {
        throw new Error('runCmd can only be used in Node.js environment');
    }
    cmd = cmd.replaceAll("\n", "").split(";").map(i => i.trim()).filter(i => !!i).join(" && ");
    try {
        const util = require('util');
        const child_process = require('child_process');
        if (!util.promisify) {
            throw new Error('util.promisify is not available. Are you running in Node.js?');
        }
        const exec = util.promisify(child_process.exec);
        const { stdout, stderr } = await exec(cmd);
        return { stdout, stderr, cmd };
    }
    catch (e) {
        console.error(e);
    }
    return {};
}
