const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { userRouter, authorizer } = require('./routers/users');
const fileRouter = require('./routers/files');
const folderRouter = require('./routers/folders');
const publicRouter = require('./routers/public');

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

// public routes
app.use('/users', userRouter);
app.use('/public', publicRouter);

// protected routes
app.use(authorizer);
app.use('/files', fileRouter);
app.use('/folders', folderRouter);

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));
