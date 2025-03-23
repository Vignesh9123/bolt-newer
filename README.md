# A Bolt.new Clone

Trying to build a [Bolt.new](https://bolt.new/) clone

## Project Structure

- `apps/code-server`: The code server (VSCode + LLM Wrapper)
- `apps/backend`: Primary backend (for API)
- `apps/web`: Frontend (Next.js)
- `packages/types`: Shared types
- `packages/db`: Database (MongoDB)
- `packages/config`: Common configuration

## Setup

### Prerequisites
- Docker - Make sure Docker is running
- Node.js
- MongoDB (Using Atlas)
- Firebase (Will be used for authentication in future)
- Gemini API Key (Will be switching to Claude most probably in the future)

- Clone the repository
- Cd into the repository
- Build the code-server image:
 ``` sh
 docker build -t code-server ./apps/code-server -f ./apps/code-server/Dockerfile.code-server
 ```
- Build the worker image:
 ``` sh
 docker build -t code-server-worker ./apps/code-server -f ./apps/code-server/Dockerfile.worker
 ```
- Create a docker volume:
 ``` sh
 docker volume create bolty-data
 ```
- Required Keys/Environment Variables:
  - Gemini API Key
  - MongoDB URI (Atlas)
  - Firebase Credentials (Will be used for authentication in future)
- Copy .env.example file to .env file in each app/package (apps/code-server, apps/backend, apps/web, packages/db, packages/config)

### Installation and Running
- Install dependencies: `npm install`
- Run Docker images:
  - `docker run -d -v bolty-data:/tmp/bolty-worker -p 8080:8080 -p 8081:8081 code-server`
  - `docker run -d -v bolty-data:/app/tmp -p 9091:9091 code-server-worker`
- Run Development Server: `npm run dev` - Will fail for apps/code-server (Which is expected as code-server worker is ran using docker)

## Problems with the current codebase

- Code Server: Streaming file changes to frontend (Just like Bolt does) - This is trickier in code-server as we maybe need to create a custom vscode extension to open the files in code-server as it is being changed/updated by the worker just like [Harkirat](https://www.youtube.com/watch?v=4JdUPCT37fI) does
  - Probable Solution: 
    - Create a custom vscode extension to open the files in code-server as it is being changed/updated by the worker - [Reference](https://youtu.be/4JdUPCT37fI?t=7389)
    - Changing the architecture of the project to use monaco, xterm(Pseudo Terminal), etc instead of code-server (Syncing files between code-server, worker and frontend(to show file structure) is going to be difficult)

## Problems Solved

- Code Server: Fast Refresh of Expo is not working (it is not refreshing the page when the code changes) .This problem is solved for Next.js by using `WATCHPACK_POLLING=true next dev` instead of just `next dev`
  - ❗❗❗IMPORTANT: This problem doesn't occur when there is no volume bind mount while running the code-server image 
  - Tried Solutions:
    - Used `WATCHPACK_POLLING=true`/ `CHOKIDAR_POLLING=true` for expo - Doesn't work
    - Port mapped the code-server to 19000, 19001, 19002 - Suggested by ChatGPT - Doesn't work
  - Worked Solution ✅: Two Container approach
    - Figuring out the way to sync files between code-server and local-system(worker) without volume bind mount will do the work most probably
      - Run worker and code-server in separate containers and sync files between them using docker volume