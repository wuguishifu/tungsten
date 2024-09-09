const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8000;

const JWT_SECRET = process.env.JWT_SECRET || 'secret :O';

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use('/users', require('./routers/users'));

app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Unauthorized');
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) return res.status(403).send('Unauthorized');

        req.user = decoded;
        next();
    });
});

app.use(require('./routers/files'));

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));
