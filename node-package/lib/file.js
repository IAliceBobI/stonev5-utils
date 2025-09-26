"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempFile = tempFile;
function tempFile(content, prefix = 'temp-', suffix = '.txt') {
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    // Get the system's temporary directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, prefix + Math.random().toString(36).substring(2) + suffix);
    if (content)
        fs.writeFileSync(tempFilePath, content);
    return tempFilePath;
}
