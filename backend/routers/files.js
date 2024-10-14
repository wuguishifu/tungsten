const express = require('express');
const fs = require('fs');
const path = require('path');
const { readData, sanitizePath, generateId } = require('../helpers/file-utils');

const DATA_PATH = process.env.DATA_PATH;

if (!fs.existsSync(path.join(DATA_PATH, '.tungsten'))) {
    fs.mkdirSync(path.join(DATA_PATH, '.tungsten'), { recursive: true });
}

if (!fs.existsSync(path.join(DATA_PATH, '.tungsten', 'public.json'))) {
    fs.writeFileSync(
        path.join(DATA_PATH, '.tungsten', 'public.json'),
        JSON.stringify({
            publicDirectories: {},
        }, null, 2)
    );
}

const router = express.Router();

router.use((req, _, next) => {
    req.homeDirectory = path.join(DATA_PATH, req.user.username);
    next();
});

router.get('/', (req, res) => {
    let { filePath } = req.query;
    if (filePath) {
        filePath = sanitizePath(filePath);
        if (!filePath) return res.status(400).send('Invalid file path');
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

router.put('/', (req, res) => {
    let { filePath } = req.query;
    if (!filePath) return res.status(400).send('Missing file path');
    filePath = sanitizePath(filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    filePath = path.join(req.homeDirectory, filePath);
    const data = req.body;
    if (data == null) return res.status(400).send('Missing data');
    if (typeof data !== 'string') return res.status(400).send('Invalid data');
    const exists = fs.existsSync(filePath);
    if (exists && fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot write to directory');
    if (exists) {
        fs.writeFileSync(filePath, data);
        res.status(200).send({ updated: true });
    } else {
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, data);
        res.status(200).send({ updated: true, files: readData(req.homeDirectory) });
    }
});

router.post('/', (req, res) => {
    let { filePath } = req.body;
    if (!filePath) return res.status(400).send('Missing file path');
    filePath = sanitizePath(filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    filePath = path.join(req.homeDirectory, filePath);
    if (fs.existsSync(filePath)) return res.status(400).send('File already exists');
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, '');
    res.status(201).send({ created: true, files: readData(req.homeDirectory) });
});

router.put('/name', (req, res) => {
    let { oldPath, newPath } = req.query;
    if (!oldPath) return res.status(400).send('Missing old file path');
    if (!newPath) return res.status(400).send('Missing new file path');
    oldPath = sanitizePath(oldPath);
    newPath = sanitizePath(newPath);
    if (!oldPath || !newPath) return res.status(400).send('Invalid file path');
    if (oldPath === newPath) return res.status(400).send('New path cannot be the same as old path');
    oldPath = path.join(req.homeDirectory, oldPath);
    newPath = path.join(req.homeDirectory, newPath);
    if (!fs.existsSync(oldPath)) return res.status(404).send('File not found');
    if (fs.existsSync(newPath)) return res.status(400).send('File already exists');
    if (newPath.split('/').length !== oldPath.split('/').length) return res.status(400).send('Cannot change file structure');
    fs.renameSync(oldPath, newPath);
    res.status(200).send({ renamed: true, files: readData(req.homeDirectory) });
});

router.post('/move', (req, res) => {
    let { oldPath, newPath } = req.body;
    if (!oldPath) return res.status(400).send('Missing old file path');
    if (!newPath) return res.status(400).send('Missing new file path');
    oldPath = sanitizePath(oldPath);
    newPath = sanitizePath(newPath);
    if (!oldPath || !newPath) return res.status(400).send('Invalid file path');
    if (oldPath === newPath) return res.status(400).send('New path cannot be the same as old path');
    oldPath = path.join(req.homeDirectory, oldPath);
    newPath = path.join(req.homeDirectory, newPath);
    if (!fs.existsSync(oldPath)) return res.status(404).send('File not found');
    if (fs.existsSync(newPath)) return res.status(400).send('File already exists');
    const dir = path.dirname(newPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.renameSync(oldPath, newPath);
    res.status(200).send({ moved: true, files: readData(req.homeDirectory) });
});

router.delete('/', (req, res) => {
    let { filePath } = req.query;
    if (!filePath) return res.status(400).send('Missing file path');
    filePath = sanitizePath(filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    filePath = path.join(req.homeDirectory, filePath);
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot delete directory');
    const fileName = path.basename(filePath);
    const trashPath = path.join(req.homeDirectory, '.trash');
    if (!fs.existsSync(trashPath)) fs.mkdirSync(trashPath, { recursive: true });
    const parts = fileName.split('.');
    const ext = parts.pop();
    const base = parts.join('.');
    let newFilePath = path.join(trashPath, `${base}.${ext}`);
    if (fs.existsSync(newFilePath)) {
        let i = 1;
        while (fs.existsSync(newFilePath)) {
            newFilePath = path.join(trashPath, `${base}.${ext}.${i}`);
            i++;
        }
    }
    fs.renameSync(filePath, newFilePath);
    res.status(200).send({ deleted: true, files: readData(req.homeDirectory) });
});

module.exports = router;
