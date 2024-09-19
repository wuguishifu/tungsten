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

router.delete('/', (req, res) => {
    let { filePath } = req.query;
    if (!filePath) return res.status(400).send('Missing file name');
    filePath = sanitizePath(filePath);
    if (!filePath) return res.status(400).send('Invalid file name');
    filePath = path.join(req.homeDirectory, '.trash', filePath);
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    fs.unlinkSync(filePath);
    res.status(200).send({ deleted: true, files: readData(req.homeDirectory) });
});

router.put('/restore', (req, res) => {
    let { filePath } = req.query;
    if (!filePath) return res.status(400).send('Missing file name');
    filePath = sanitizePath(filePath);
    if (!filePath) return res.status(400).send('Invalid file name');
    filePath = path.join(req.homeDirectory, '.trash', filePath);
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    const basename = path.basename(filePath);
    const [filename, ext] = basename.split('.');
    let newFilePath = path.join(req.homeDirectory, `${filename}.${ext}`);
    if (fs.existsSync(path.join(req.homeDirectory, `${filename}.${ext}`))) {
        let i = 1;
        while (fs.existsSync(path.join(req.homeDirectory, `${filename} (${i}).${ext}`))) {
            i++
        }
        newFilePath = path.join(req.homeDirectory, `${filename} (${i}).${ext}`);
    }
    fs.renameSync(filePath, newFilePath);
    res.status(200).send({ restored: true, files: readData(req.homeDirectory) });
});

router.delete('/all', (req, res) => {
    const trashPath = path.join(req.homeDirectory, '.trash');
    if (!fs.existsSync(trashPath)) return res.status(404).send('Trash is empty');
    // delete entire trash dir and then just make a new trash dir
    fs.rmdirSync(trashPath, { recursive: true });
    fs.mkdirSync(trashPath, { recursive: true });
    res.status(200).send({ deleted: true, files: readData(req.homeDirectory) });
});

module.exports = router;
