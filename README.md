# Tungsten

Tungsten is a very lightweight and simple self-hostable note taking app. It's designed to store information without the use of a database, meaning you can very easily import/export notes.

> View the changelog [here](https://github.com/wuguishifu/tungsten/blob/master/CHANGELOG.md)

## Basic details

- Notes are saved to the filesystem in the docker container. It is strongly advised that you mount a volume onto the container (see more information in [Setup Instructions](#setup-instructions) and [Data Storage](#data-storage)).
- There is very basic user authentication with username/password handled through JWT.
- Every user has their own home directory for notes. This means that users can only access their own notes.
- Notes are stored in the file system. The only crucial non-note file information is the authentication file. This means that you are free to import and export notes as required, as long as you maintain the correct file structure.
- There is vim more or normal input.

## Setup Instructions

An all-in-one docker container is available. The recommended way to run it is through a docker-compose file like this:

```yml
# docker-compose.yml

services:
  tungsten:
    image: ghcr.io/wuguishifu/tungsten:latest
    container_name: tungsten
    restart: unless-stopped
    volumes:
      - ~/data:/data
      - ~/auth.json:/auth.json
    environment:
      JWT_SECRET: your-jwt-secret
      JWT_TTL: 60m
      HTTPS: false
      ENABLE_USER_SIGNUP: false
    ports:
      - 4370:4370
```

> Here are some quick links.

[Environmental Variables](#environmental-variables)<br>
[Data Storage](#data-storage)<br>
[Authentication](#authentication)

### Environmental Variables

There are a few environmental variables that you (must) configure.

- `JWT_SECRET`: This environmental variable is used to generate JWTs for authentication. This should not be publicized, and you should consider putting this in a `.env` file instead of hard coding it within your `docker-compose.yml`.

- `JWT_TTL`: This is how long a user will stay logged in while idle. While the user is interacting with the webapp, the token will be refreshed before it expires. If the user leaves the webapp, the token will not be refreshed once it expires, and they will have to log in again next time.

- `HTTPS`: Set this to true if you're hosting the webapp behind an HTTPS domain. This is used by JWT.

- `ENABLE_USER_SIGNUP`: Allow users to sign up through the webapp or not. See [Authentication](#authentication) for more information.

### Data Storage

Notes are stored in the container at `/data`. A single file is required to hold user authentication data, which is stored in the container at `/auth.json`. This is the format of the saved notes:

```txt
data/
├── .tungsten/
└── [username]/
    └── [user-specific notes]
```

The `.tungsten/` folder contains minimal required files for functionality. These aren't directly implemented yet, but are subject to future updates.

### Authentication

When users are created (either through the webapp or through the cli tool), they will be added to `auth.json`. The format of this file is:

```json
{
  "[username]": {
    "password": "a bcrypt salt/hashed password"
  }
}
```

The structure of this file may change in future updates, but I will try to guarantee backwards compatability as much as possible. Although the passwords are encrypted, this file should still be considered secure information, and should not be publicized. There is no way to access the file from the webapp.

Currently, users can be added through the register page (if `ALLOW_USER_SIGNUP=true`) or via the CLI tool. I'm going to make this not as shit in the future. Here's how you can exec into the container and manually run the cli tool.

1. While the container is running, exec into it

    ```bash
    docker exec -it tungsten /bin/bash
    ```

2. This should put you into the `/app/backend` directory. If not, just `cd /app/backend`.

3. Run the cli tool.

    ```bash
    node create-user.js -u <username> -p <password>
    ```

> Hint: you can add a user through the registration page, then turn off `ALLOW_USER_SIGNUP` and restart the container.

Sorry for the inconvenience, I'm working on the registration system on the frontend and I'll make the CLI tool better. To be honest, neither of these have been a priority for me because I'm working more on improvements/enhancements to the actual notebook. If anyone wants to mess around with it, I'll be happy to merge PRs.

---

Alright, that's all for setup. If anyone has questions, feel free to reach out to me. My discord is @wuguishifu.

## Development

Visit the [Trello Kanban](https://trello.com/b/wL2Bg5XN/tungsten) to see the status of the project!

Contributions are always welcome, just submit a PR. If you have any feature requests and DON'T want to build them, submit an issue or reach out to me on discord (@wuguishifu)!
