export function tempFile(content: string, prefix: string = 'temp-', suffix: string = '.txt') {
    const fs: typeof import('fs') = require('fs');
    const os: typeof import('os') = require('os');
    const path: typeof import('path') = require('path');
    // Get the system's temporary directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, prefix + Math.random().toString(36).substring(2) + suffix);
    if (content) fs.writeFileSync(tempFilePath, content);
    return tempFilePath;
}

