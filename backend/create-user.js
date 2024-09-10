const fs = require('fs');
const bcrypt = require('bcrypt');
const args = require('minimist')(process.argv.slice(2));

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
    if (users[username]) return process.exit(1);

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
