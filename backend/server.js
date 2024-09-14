const express = require('express');
const http = require('http');

const { userRouter, authorizer } = require('./routers/users');
const fileRouter = require('./routers/files');
const folderRouter = require('./routers/folders');
const publicRouter = require('./routers/public');
const cookieParser = require('cookie-parser');

const app = express();
const port = 4370;

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());
app.use(cookieParser());

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
