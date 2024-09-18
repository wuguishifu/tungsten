const express = require('express');
const fs = require('fs');
const path = require('path');
const { readData, sanitizePath, findAllChildFiles, generateId } = require('../helpers/file-utils');

const DATA_PATH = process.env.DATA_PATH;

const router = express.Router();

router.use((req, _, next) => {
    req.homeDirectory = path.join(DATA_PATH, req.user.username);
    next();
});

const reservedFolderNames = [
    '.trash',
];

router.post('/', (req, res) => {
    let { folderPath } = req.body;
    if (reservedFolderNames.includes(path.basename(folderPath))) return res.status(400).send('Cannot create folder with reserved name');
    if (!folderPath) return res.status(400).send('Missing folder path');
    folderPath = sanitizePath(folderPath);
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
    oldPath = sanitizePath(oldPath);
    newPath = sanitizePath(newPath);
    if (!oldPath || !newPath) return res.status(400).send('Invalid folder path');
    if (oldPath === newPath) return res.status(400).send('New path cannot be the same as old path');
    oldPath = path.join(req.homeDirectory, oldPath);
    newPath = path.join(req.homeDirectory, newPath);
    if (!fs.existsSync(oldPath)) return res.status(404).send('Folder not found');
    if (fs.existsSync(newPath)) return res.status(400).send('Folder already exists');
    if (newPath.split('/').length !== oldPath.split('/').length) return res.status(400).send('Cannot change file structure');
    fs.renameSync(oldPath, newPath);
    res.status(200).send({ renamed: true, files: readData(req.homeDirectory) });
});

router.delete('/', (req, res) => {
    let { folderPath } = req.query;
    if (!folderPath) return res.status(400).send('Missing folder path');
    folderPath = sanitizePath(folderPath);
    if (!folderPath) return res.status(400).send('Invalid folder path');
    folderPath = path.join(req.homeDirectory, folderPath);
    if (!fs.existsSync(folderPath)) return res.status(404).send('Folder not found');
    if (!fs.statSync(folderPath).isDirectory()) return res.status(400).send('Cannot delete file');
    const trashPath = path.join(req.homeDirectory, '.trash');
    if (!fs.existsSync(trashPath)) fs.mkdirSync(trashPath, { recursive: true });
    const files = findAllChildFiles(folderPath);
    if (files.length > 0) files.forEach(({ fullPath, basename }) => {
        const parts = basename.split('.');
        const ext = parts.pop();
        const base = parts.join('.');
        const newFileName = `${base}.${ext}.${generateId(8)}`;
        fs.renameSync(fullPath, path.join(trashPath, newFileName));
    });
    fs.rmSync(folderPath, { recursive: true });
    res.status(200).send({ deleted: true, files: readData(req.homeDirectory) });
});

router.put('/privacy', (req, res) => {
    let { folderPath } = req.query;
    const isPublic = req.body.privacy === 'public';
    if (!folderPath) return res.status(400).send('Missing folder path');
    folderPath = sanitizePath(folderPath, { normalize: false });
    if (!folderPath) return res.status(400).send('Invalid folder path');
    // intentionally not normalizing the path for linux-style paths in the public.json file
    folderPath = `${req.user.username}/${folderPath}`;
    setFolderPrivacy(folderPath, isPublic);
    return res.status(200).send({ updated: true });
});

module.exports = router;

function setFolderPrivacy(folderPath, isPublic) {
    const publicPath = path.join(DATA_PATH, '.tungsten', 'public.json');
    const data = JSON.parse(fs.readFileSync(publicPath));
    if (folderPath in data.publicDirectories) {
        if (isPublic) {
            data.publicDirectories[folderPath].isPublic = true;
        } else {
            delete data.publicDirectories[folderPath].isPublic;
            if (Object.keys(data.publicDirectories[folderPath]).length === 0) {
                delete data.publicDirectories[folderPath];
            }
        }
    } else if (isPublic) {
        data.publicDirectories[folderPath] = { isPublic: true };
    }
    fs.writeFileSync(publicPath, JSON.stringify(data, null, 2));
}
