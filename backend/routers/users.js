const bcrypt = require('bcryptjs');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const path = require('path');

const { reservedKeywords } = require('../helpers/reserved');

const USERS_FILE_PATH = process.env.USERS_FILE_PATH;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TTL = process.env.JWT_TTL;
const DATA_PATH = process.env.DATA_PATH;
const IS_HTTPS = process.env.HTTPS;
const ENABLE_USER_SIGNUP = process.env.ENABLE_USER_SIGNUP;

const SALT_ROUNDS = 10;

const router = express.Router();

const readUsers = () => {
    if (!fs.existsSync(USERS_FILE_PATH)) return {};
    const data = fs.readFileSync(USERS_FILE_PATH);
    return JSON.parse(data);
};

const writeUsers = (users) => fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
const generateAccessToken = (username) => jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_TTL });

router.post('/register', async (req, res) => {
    if (!ENABLE_USER_SIGNUP) return res.status(403).send('User registration is disabled');
    const { username, password } = req.body;
    if (username.length > 128) return res.status(400).send('Invalid username');
    if (/[^a-zA-Z0-9]/.test(username)) return res.status(400).send('Invalid username');
    if (!username) return res.status(400).send('Missing username');
    if (!password) return res.status(400).send('Missing password');
    if (reservedKeywords.includes(username)) return res.status(400).send('Invalid username');
    const users = readUsers();
    if (users[username]) return res.status(400).send('User already exists');
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    users[username] = { password: hash };
    writeUsers(users);
    const accessToken = generateAccessToken(username);
    res.cookie('jwt', accessToken, { httpOnly: true, secure: IS_HTTPS, sameSite: 'strict', maxAge: ms(JWT_TTL) });
    res.status(201).send({ username, tokenExpirationMs: ms(JWT_TTL) });
    if (!fs.existsSync(path.join(DATA_PATH, username))) {
        fs.mkdirSync(path.join(DATA_PATH, username), { recursive: true });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username) return res.status(400).send('Missing username');
    if (!password) return res.status(400).send('Missing password');
    const users = readUsers();
    if (!users[username]) return res.status(401).send('Invalid username or password');
    const match = await bcrypt.compare(password, users[username].password);
    if (!match) return res.status(401).send('Invalid username or password');
    const accessToken = generateAccessToken(username);
    res.cookie('jwt', accessToken, { httpOnly: true, secure: IS_HTTPS, sameSite: 'strict', maxAge: ms(JWT_TTL) });
    res.status(200).send({ username, tokenExpirationMs: ms(JWT_TTL) });
    if (!fs.existsSync(path.join(DATA_PATH, username))) {
        fs.mkdirSync(path.join(DATA_PATH, username), { recursive: true });
    }
});

router.post('/refresh', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send('Unauthorized');
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) return res.status(403).send('Unauthorized');
        const accessToken = generateAccessToken(decoded.username);
        res.cookie('jwt', accessToken, { httpOnly: true, secure: IS_HTTPS, sameSite: 'strict', maxAge: ms(JWT_TTL) });
        res.status(200).send({ username: decoded.username, tokenExpirationMs: ms(JWT_TTL) });
    });
});

router.post('/logout', (_, res) => {
    res.clearCookie('jwt');
    res.status(200).send('OK');
});

module.exports = {
    userRouter: router,
    authorizer: express.Router().use((req, res, next) => {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).send('Unauthorized');
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) return res.status(403).send('Unauthorized');
            req.user = decoded;
            next();
        });
    }),
};
