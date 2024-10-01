# Development

## Setting up the environment

It's pretty easy to set up. First, Clone/fork/download the repo. There should be two main folders: `frontend/` and `/backend`. Also, make sure you have [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), [Node.js](https://nodejs.org/en), and [npm](https://www.npmjs.com/) installed. If you're on Windows or Mac, you will also need to install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Docker to work.

1. Clone/fork/download the repo.
    - The two main folders are `frontend/` and `backend/`.

2. Install the required libraries in both folders.

    ```bash
    cd frontend && npm i && cd ../backend && npm i
    ```

### Backend Setup

The backend is a docker container. You can also run it with something like nodemon, but I haven't messed around with that soooo gl lol.

1. First, make a `.env` file. In the `.env` file, add the `JWT_SECRET` key:

    ```bash
    JWT_SECRET="my super secret token"
    ```

2. Make a directory `test-data/` in the project root. This is where test data will be.

3. Make a file `auth.json` in the project root. This is where test users will be.

4. Run the cli to generate a new user:

    ```bash
    cd backend # make sure you're in the `backend/` directory
    node create-user.js -u <username> -p <password>
    ```

5. Start the docker container and you should be all set:

    ```bash
    cd backend # make sure you're in the `backend/` directory
    npm run dev # or, `docker-compose up --build`
    ```

    - Every time you make edits to the backend server, you will have to relaunch the container. Sorry in advance that it's in just straight up JS, I may rebuild it in TS or Rust if I get around to it and if it becomes a pain to maintain.

    - If you're not making edits to the backend and don't want to keep this terminal open, add the -d flag to the command:

        ```bash
        npm run dev -- -d # or, `docker-compose up --build -d`
        ```

        You can then stop the server with `docker-compose down` or `npm stop`

### Frontend Setup

The frontend is a vite + react project. It's much easier to set up than the backend.

1. First, make a `.env` file. In the `.env` file, add the `VITE_PUBLIC_REGISTRATION_ENABLED` key:

    ```bash
    VITE_PUBLIC_REGISTRATION_ENABLED=false # or true
    ```

2. Run the frontend with the start command. This will listen for changes and hot reload the page:

    ```bash
    cd frontend # make sure you're in the `frontend/` directory
    npm run dev
    ```

## Testing

Before you submit any PRs, please make sure to test your feature/whatever with the AIO docker container. If you've set everything up correctly so far, you should be able to just run the `docker-compose.yml` in the root directory and it should launch the AIO.

```bash
cd / # make sure you're in the project's root directory
docker-compose up --build
```
