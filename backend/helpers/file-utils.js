const fs = require('fs');
const path = require('path');

function readData(homeDirectory) {
    function r(currentPath) {
        const result = {
            __path: path.relative(homeDirectory, currentPath),
        };
        const files = fs.readdirSync(currentPath);

        files.forEach(file => {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);
            const relativeFilePath = path.relative(homeDirectory, filePath);

            if (stat.isDirectory()) {
                // Recursively add subdirectory
                result[`${file}/`] = r(filePath);
            } else {
                // Add file with the relative path as the value
                result[file] = relativeFilePath;
            }
        });

        return result;
    }

    // Start reading from the home directory
    return r(homeDirectory);
}

function sanitizePath(filePath, opts = { normalize: true }) {
    let p = filePath;
    if (opts.normalize) p = path.normalize(filePath);
    if (p.includes('..')) return null;
    if (!/^[a-zA-Z0-9\/\\\-_ .]+$/.test(p)) return null;
    return p;
}

module.exports = {
    readData,
    sanitizePath,
};
