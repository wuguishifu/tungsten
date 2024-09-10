const express = require('express');
const fs = require('fs');
const path = require('path');

// normal directory traversal
const DATA_PATH = process.env.DATA;

const router = express.Router();

const readData = () => {
    const result = [];
    function readDir(currentPath) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                result.push({ path: filePath, type: 'directory', name: file });
                readDir(filePath);
            } else {
                result.push({ path: filePath, type: 'file', name: file });
            }
        });
    }
    readDir(DATA_PATH);
    return result;
};

const sanitizeFilePath = (filePath) => {
    let p = path.normalize(filePath);
    if (!p.startsWith(DATA_PATH)) return null;
    if (p.includes('..')) return null;
    if (p.endsWith('.md')) return p;
    return p + '.md';
};

const sanitizeFolderPath = (folderPath) => {
    let p = path.normalize(folderPath);
    if (!p.startsWith(DATA_PATH)) return null;
    if (p === DATA_PATH) return null;
    if (p.includes('..')) return null;
    return p;
};

router.get('/files', (req, res) => {
    let { filePath } = req.query;
    if (filePath) {
        filePath = sanitizeFilePath(filePath);
        if (!filePath) return res.status(400).send('Invalid file path');
        if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
        if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot read directory');
        const data = fs.readFileSync(filePath);
        res.status(200).send(data);
    } else {
        res.status(200).send({ files: readData() });
    }
});

router.put('/files', (req, res) => {
    if (!req.query.filePath) return res.status(400).send('Missing file path');
    const filePath = sanitizeFilePath(req.query.filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    const data = req.body;
    if (!data) return res.status(400).send('Missing data');
    if (typeof data !== 'string') return res.status(400).send('Invalid data');
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot write to directory');
    fs.writeFileSync(filePath, data);
    res.status(200).send({ updated: true });
});

router.post('/files', (req, res) => {
    if (!req.body.filePath) return res.status(400).send('Missing file path');
    const filePath = sanitizeFilePath(req.body.filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    if (fs.existsSync(filePath)) return res.status(400).send('File already exists');
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, '');
    res.status(201).send({ created: true, newFiles: readData() });
});

router.put('/files/name', (req, res) => {
    if (!req.query.oldPath || !req.query.newPath) return res.status(400).send('Missing old or new file path');
    const oldPath = sanitizeFilePath(req.query.oldPath);
    const newPath = sanitizeFilePath(req.query.newPath);
    if (!oldPath || !newPath) return res.status(400).send('Invalid file path');
    if (oldPath === newPath) return res.status(400).send('New path cannot be the same as old path');
    if (!fs.existsSync(oldPath)) return res.status(404).send('File not found');
    if (fs.existsSync(newPath)) return res.status(400).send('File already exists');
    fs.renameSync(oldPath, newPath);
    res.status(200).send({ renamed: true, newFiles: readData() });
});

router.delete('/files', (req, res) => {
    if (!req.query.filePath) return res.status(400).send('Missing file path');
    const filePath = sanitizeFilePath(req.query.filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot delete directory');
    fs.unlinkSync(filePath);
    res.status(200).send({ deleted: true, newFiles: readData() });
});

router.post('/folders', (req, res) => {
    if (!req.body) return res.status(400).send('Missing folder path');
    const folderPath = sanitizeFolderPath(req.body.folderPath);
    if (!folderPath) return res.status(400).send('Invalid folder path');
    if (fs.existsSync(folderPath)) return res.status(400).send('Folder already exists');
    fs.mkdirSync(folderPath, { recursive: true });
    res.status(201).send({ created: true, newFiles: readData() });
});

router.put('/folders/name', (req, res) => {
    if (!req.query.oldPath || !req.query.newPath) return res.status(400).send('Missing old or new folder path');
    const oldPath = sanitizeFolderPath(req.query.oldPath);
    const newPath = sanitizeFolderPath(req.query.newPath);
    if (!oldPath || !newPath) return res.status(400).send('Invalid folder path');
    if (oldPath === newPath) return res.status(400).send('New path cannot be the same as old path');
    if (!fs.existsSync(oldPath)) return res.status(404).send('Folder not found');
    if (fs.existsSync(newPath)) return res.status(400).send('Folder already exists');
    fs.renameSync(oldPath, newPath);
    res.status(200).send({ renamed: true, newFiles: readData() });
});

router.delete('/folders', (req, res) => {
    if (!req.query.folderPath) return res.status(400).send('Missing folder path');
    const folderPath = sanitizeFolderPath(req.query.folderPath);
    if (!folderPath) return res.status(400).send('Invalid folder path');
    if (!fs.existsSync(folderPath)) return res.status(404).send('Folder not found');
    if (!fs.statSync(folderPath).isDirectory()) return res.status(400).send('Cannot delete file');
    if (fs.readdirSync(folderPath).length > 0) return res.status(400).send('Cannot delete non-empty folder');
    fs.rmSync(folderPath, { recursive: true });
    res.status(200).send({ deleted: true, newFiles: readData() });
});

module.exports = router;
