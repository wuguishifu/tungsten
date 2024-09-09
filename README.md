# The Plan

## Overview

- Self hostable note taking app with an all-in-one docker container
- Editor that supports Markdown and LaTeX
- Toggle for vim input mode
- Save notes in a file structure so that it can be synced with git
- System for automatically pushing/pulling from GitHub (, or any git provider?)
- Clean UI with dark and light mode

## Details

- One container, so the container will have to run a server that will serve the frontend and the api
- The server will also be responsible for handling edits through an API
- Can probably use Node.js (maybe want to use Rust?) and serve a React app
  - Next.js may be ideal because I can ssr the pages and make it faster
    - This build would happen on container startup likely
  - Also, I can then take advantage of shadcn/ui if I want to but not sure
