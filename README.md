# The Plan

[Trello Kanban](https://trello.com/b/wL2Bg5XN/tungsten)

## Overview

- Self hostable note taking app with an all-in-one docker container
- Editor that supports Markdown and LaTeX
- Toggle for vim input mode
- Save notes in a file structure so that it can be synced with git
- ~~System for automatically pushing/pulling from GitHub (, or any git provider?)~~
  - This can be managed by the user, that way they can also do things like git lfs if they have a lot of images
- Clean UI with dark and light mode

## Details

- One container, so the container will have to run a server that will serve the frontend and the api
- The server will also be responsible for handling edits through an API
- Can probably use Node.js (maybe want to use Rust?) and serve a React app
  - Next.js may be ideal because I can ssr the pages and make it faster
    - This build would happen on container startup likely
  - Also, I can then take advantage of shadcn/ui if I want to but not sure

## Todo

- [x] Change the file system to be sandboxed to logged in usernames
  - Currently it's using the DATA_PATH env variable for all files, I want to change this so that if you're logged in your edits are going to be sanboxed into DATA_PATH/$username
- [x] Add settings for public/private folders that can be accessed with/without being logged in
  - This will behave like a readonly wiki
