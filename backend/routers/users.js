const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_FILE = process.env.USERS_FILE || './auth.json';
const JWT_SECRET = process.env.JWT_SECRET || 'secret :O';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

const router = express.Router();

const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return {};
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Missing username or password');
    const users = readUsers();
    if (!users[username]) return res.status(401).send('Invalid username or password');
    const match = await bcrypt.compare(password, users[username].password);
    if (!match) return res.status(401).send('Invalid username or password');
    res.send({ token: jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION }) });
});

module.exports = router;
