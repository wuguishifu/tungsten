const fs = require('fs');
const path = require('path');

const defaultExcludedDirs = [
    '.git',
];

function readData(homeDirectory) {
    function r(currentPath) {
        const relativePath = path.relative(homeDirectory, currentPath);
        const name = path.basename(currentPath);

        const result = {
            type: 'directory',
            name: name,
            path: relativePath,
            dirPath: relativePath,
            children: [],
        };

        const files = fs.readdirSync(currentPath);

        files.forEach(file => {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);
            const relativeFilePath = path.relative(homeDirectory, filePath);

            if (stat.isDirectory()) {
                // Recursively add subdirectory
                if (defaultExcludedDirs.includes(file)) {
                    return;
                }
                const dir = r(filePath);
                result.children.push(dir);
            } else {
                // Add file
                const fileObj = {
                    type: 'file',
                    name: file,
                    path: relativeFilePath,
                    dirPath: relativePath,
                };
                result.children.push(fileObj);
            }
        });

        return result;
    }

    // Start reading from the home directory
    return r(homeDirectory);
}

function findAllChildFiles(dirPath) {
    const filesArray = [];
    function r(dir) {
        const items = fs.readdirSync(dir);
        items.forEach(i => {
            const itemPath = path.join(dir, i);
            if (fs.statSync(itemPath).isDirectory()) {
                r(itemPath);
            } else {
                filesArray.push({
                    basename: path.basename(itemPath),
                    fullPath: itemPath,
                });
            }
        });
    }

    r(dirPath);
    return filesArray;
}

function sanitizePath(filePath, opts = { normalize: true }) {
    let p = filePath;
    if (opts.normalize) p = path.normalize(filePath);
    if (p.includes('..')) return null;
    if (!/^[a-zA-Z0-9\/\\\-_ .\(\)]+$/.test(p)) return null;
    return p;
}

function generateId(length = 6) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

module.exports = {
    readData,
    sanitizePath,
    findAllChildFiles,
    generateId,
};
