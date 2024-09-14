const express = require('express');
const cookies = require('cookie-parser');
const cors = require('cors');
const http = require('http');

const { userRouter, authorizer } = require('./routers/users');
const fileRouter = require('./routers/files');
const folderRouter = require('./routers/folders');
const publicRouter = require('./routers/public');

const app = express();
let port = +process.env.PORT ?? 4370;
if (isNaN(port)) port = 4370;

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());
app.use(cookies());

// public routes
app.use('/users', userRouter);
app.use('/public', publicRouter);

// protected routes
app.use(authorizer);
app.use('/files', fileRouter);
app.use('/folders', folderRouter);

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));

process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    server.close();
    process.exit(0);
});
