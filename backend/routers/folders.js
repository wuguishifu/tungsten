const express = require('express');
const fs = require('fs');
const path = require('path');
const { readData, sanitizePath } = require('../helpers/file-utils');

const DATA_PATH = process.env.DATA_PATH;

const router = express.Router();

router.use((req, _, next) => {
    req.homeDirectory = path.join(DATA_PATH, req.user.username);
    next();
});

router.post('/', (req, res) => {
    const { folderPath } = req.body;
    if (!folderPath) return res.status(400).send('Missing folder path');
    folderPath = sanitizePath(req.body.folderPath);
    if (!folderPath) return res.status(400).send('Invalid folder path');
    folderPath = path.join(req.homeDirectory, folderPath);
    if (fs.existsSync(folderPath)) return res.status(400).send('Folder already exists');
    fs.mkdirSync(folderPath, { recursive: true });
    res.status(201).send({ created: true, files: readData(req.homeDirectory) });
});

router.put('/name', (req, res) => {
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

router.delete('/', (req, res) => {
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
