const fs = require('fs');
const bcrypt = require('bcryptjs');
const args = require('minimist')(process.argv.slice(2));

const { reservedKeywords } = require('./helpers/reserved');

const USERS_FILE_PATH = process.env.USERS_FILE_PATH;
const SALT_ROUNDS = 10;

const readUsers = () => {
    if (!fs.existsSync(USERS_FILE_PATH)) return {};
    const data = fs.readFileSync(USERS_FILE_PATH);
    try {
        return JSON.parse(data);
    } catch {
        return {}
    }
}

const createUser = (username, password) => {
    const users = readUsers();
    if (users[username]) {
        console.log('User already exists.');
        return process.exit(1);
    }

    if (reservedKeywords.includes(username)) {
        console.log('Invalid username. Check the README.md for a list of reserved keywords.');
        return process.exit(1);
    }

    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    users[username] = { password: hash };
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    process.exit(0);
}

if ((args.username == null && args.u == null) || (args.password == null && args.p == null)) {
    console.log('Usage: create-user --u[sername] <username> --p[assword] <password>');
    process.exit(1);
}

createUser(args.username || args.u, args.password || args.p);
