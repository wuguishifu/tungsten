const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { userRouter, authorizer } = require('./routers/users');
const fileRouter = require('./routers/files');

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use('/users', userRouter);
app.use(authorizer);
app.use(fileRouter);

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));
