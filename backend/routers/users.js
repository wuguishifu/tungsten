const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_FILE_PATH = process.env.USERS_FILE_PATH;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = +process.env.JWT_EXPIRATION;

const router = express.Router();

const readUsers = () => {
    if (!fs.existsSync(USERS_FILE_PATH)) return {};
    const data = fs.readFileSync(USERS_FILE_PATH);
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

module.exports = {
    userRouter: router,
    authorizer: express.Router().use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(403).send('Unauthorized');
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) return res.status(403).send('Unauthorized');
            req.user = decoded;
            next();
        });
    }),
};
