const express = require('express');
const fs = require('fs');
const path = require('path');
const { sanitizePath } = require('../helpers/file-utils');

const DATA_PATH = process.env.DATA_PATH;

const router = express.Router();

function checkPublicity(filePath) {
    const settingsPath = path.join(DATA_PATH, '.tungsten', 'public.json');
    if (!fs.readFileSync(settingsPath)) return false;
    const data = JSON.parse(fs.readFileSync(path.join(DATA_PATH, '.tungsten', 'public.json'), 'utf-8'));
    if (data.publicDirectories[filePath]?.isPublic) return true;
    return false;
}

router.get('/file', (req, res) => {
    let { filePath } = req.query;
    if (!filePath) return res.status(400).send('Missing file path');
    filePath = sanitizePath(filePath);
    if (!filePath) return res.status(400).send('Invalid file path');
    filePath = path.join(DATA_PATH, filePath);
    const dirPath = path.relative(DATA_PATH, path.dirname(filePath));
    if (!checkPublicity(dirPath.split(path.sep).join('/'))) return res.status(404).send('File not found');
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    if (fs.statSync(filePath).isDirectory()) return res.status(400).send('Cannot read directory');
    res.status(200).send(fs.readFileSync(filePath));
});

module.exports = router;
