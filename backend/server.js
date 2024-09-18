const express = require('express');
const cookies = require('cookie-parser');
const cors = require('cors');
const http = require('http');

const { userRouter, authorizer } = require('./routers/users');
const fileRouter = require('./routers/files');
const folderRouter = require('./routers/folders');
const publicRouter = require('./routers/public');
const deletedRouter = require('./routers/deleted');

const app = express();
let port = +process.env.PORT ?? 4370;
if (isNaN(port)) port = 4370;

app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());
app.use(cookies());

app.use((req, _, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

const api = express.Router();

// public routes
api.use('/users', userRouter);
api.use('/public', publicRouter);

// protected routes
api.use(authorizer);
api.use('/files', fileRouter);
api.use('/folders', folderRouter);
api.use('/deleted', deletedRouter);

app.use('/api', api);

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
