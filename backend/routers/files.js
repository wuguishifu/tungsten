const express = require('express');
const fs = require('fs');
const path = require('path');

const DATA_PATH = process.env.DATA_PATH;

const router = express.Router();

router.use((req, _, next) => {
    req.homeDirectory = path.join(DATA_PATH, req.user.username);
    next();
});

router.get('/files', (req, res) => {
    let { filePath } = req.query;
    if (filePath) {
        filePath = sanitizePath(filePath);
        filePath = path.join(req.homeDirectory, filePath);
        if (!filePath) return res.status(400).send('Invalid file path');
        if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
        if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot read directory');
        const data = fs.readFileSync(filePath);
        res.status(200).send(data);
    } else {
        res.status(200).send({ files: readData(req.homeDirectory) });
    }
});

router.put('/files', (req, res) => {
    let { filePath } = req.query;
    if (!filePath) return res.status(400).send('Missing file path');
    filePath = sanitizePath(req.query.filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    filePath = path.join(req.homeDirectory, filePath);
    const data = req.body;
    if (!data) return res.status(400).send('Missing data');
    if (typeof data !== 'string') return res.status(400).send('Invalid data');
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot write to directory');
    fs.writeFileSync(filePath, data);
    res.status(200).send({ updated: true });
});

router.post('/files', (req, res) => {
    let { filePath } = req.body;
    if (!filePath) return res.status(400).send('Missing file path');
    filePath = sanitizePath(req.body.filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    filePath = path.join(req.homeDirectory, filePath);
    if (fs.existsSync(filePath)) return res.status(400).send('File already exists');
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, '');
    res.status(201).send({ created: true, files: readData(req.homeDirectory) });
});

router.put('/files/name', (req, res) => {
    let { oldPath, newPath } = req.query;
    if (!oldPath) return res.status(400).send('Missing old file path');
    if (!newPath) return res.status(400).send('Missing new file path');
    oldPath = sanitizePath(req.query.oldPath);
    newPath = sanitizePath(req.query.newPath);
    if (!oldPath || !newPath) return res.status(400).send('Invalid file path');
    if (oldPath === newPath) return res.status(400).send('New path cannot be the same as old path');
    oldPath = path.join(req.homeDirectory, oldPath);
    newPath = path.join(req.homeDirectory, newPath);
    if (!fs.existsSync(oldPath)) return res.status(404).send('File not found');
    if (fs.existsSync(newPath)) return res.status(400).send('File already exists');
    fs.renameSync(oldPath, newPath);
    res.status(200).send({ renamed: true, files: readData(req.homeDirectory) });
});

router.delete('/files', (req, res) => {
    let { filePath } = req.query;
    if (!filePath) return res.status(400).send('Missing file path');
    filePath = sanitizePath(req.query.filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    filePath = path.join(req.homeDirectory, filePath);
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot delete directory');
    fs.unlinkSync(filePath);
    res.status(200).send({ deleted: true, files: readData(req.homeDirectory) });
});

router.post('/folders', (req, res) => {
    const { folderPath } = req.body;
    if (!folderPath) return res.status(400).send('Missing folder path');
    folderPath = sanitizePath(req.body.folderPath);
    if (!folderPath) return res.status(400).send('Invalid folder path');
    folderPath = path.join(req.homeDirectory, folderPath);
    if (fs.existsSync(folderPath)) return res.status(400).send('Folder already exists');
    fs.mkdirSync(folderPath, { recursive: true });
    res.status(201).send({ created: true, files: readData(req.homeDirectory) });
});

router.put('/folders/name', (req, res) => {
    let { oldPath, newPath } = req.query;
    if (!oldPath) return res.status(400).send('Missing old folder path');
    if (!newPath) return res.status(400).send('Missing new folder path');
    oldPath = sanitizePath(req.query.oldPath);
    newPath = sanitizePath(req.query.newPath);
    if (!oldPath || !newPath) return res.status(400).send('Invalid folder path');
    if (oldPath === newPath) return res.status(400).send('New path cannot be the same as old path');
    oldPath = path.join(req.homeDirectory, oldPath);
    newPath = path.join(req.homeDirectory, newPath);
    if (!fs.existsSync(oldPath)) return res.status(404).send('Folder not found');
    if (fs.existsSync(newPath)) return res.status(400).send('Folder already exists');
    fs.renameSync(oldPath, newPath);
    res.status(200).send({ renamed: true, files: readData(req.homeDirectory) });
});

router.delete('/folders', (req, res) => {
    let { folderPath } = req.query;
    if (!folderPath) return res.status(400).send('Missing folder path');
    folderPath = sanitizePath(req.query.folderPath);
    if (!folderPath) return res.status(400).send('Invalid folder path');
    folderPath = path.join(req.homeDirectory, folderPath);
    if (!fs.existsSync(folderPath)) return res.status(404).send('Folder not found');
    if (!fs.statSync(folderPath).isDirectory()) return res.status(400).send('Cannot delete file');
    if (fs.readdirSync(folderPath).length > 0) return res.status(400).send('Cannot delete non-empty folder');
    fs.rmSync(folderPath, { recursive: true });
    res.status(200).send({ deleted: true, files: readData(req.homeDirectory) });
});

module.exports = router;

function readData(homeDirectory) {
    function r(currentPath) {
        const result = {};
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
    const rootName = path.basename(homeDirectory);
    return { [`${rootName}/`]: r(homeDirectory) };
}

function sanitizePath(filePath) {
    let p = path.normalize(filePath);
    if (p.includes('..')) return null;
    if (!/^[a-zA-Z0-9\/\\-_ .]+$/.test(p)) return null;
    return p;
}
