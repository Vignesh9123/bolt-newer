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
- MongoDB (Using Docker or Atlas)
- Firebase (Will be used for authentication in future)
- Gemini API Key (Will be switching to Claude most probably in the future)
- Build the code-server image:
 ``` sh
 docker build -t code-server ./apps/code-server -f ./apps/code-server/Dockerfile.code-server
 ```
- Required Keys/Environment Variables:
  - Gemini API Key
  - MongoDB URI (Cloud or Local)
  - Firebase Credentials (Will be used for authentication in future)
- Copy .env.example file to .env file in each app/package (apps/code-server, apps/backend, apps/web, packages/db, packages/config)

### Installation and Running
- Install dependencies: `npm install`
- Run Development Server: `npm run dev`

## Problems with the current codebase

- Code Server: Fast Refresh of Expo is not working (it is not refreshing the page when the code changes) .This problem is solved for Next.js by using `WATCHPACK_POLLING=true next dev` instead of just `next dev`
  - Tried Solutions:
    - Used `WATCHPACK_POLLING=true`/ `CHOKIDAR_POLLING=true` for expo - Doesn't work
    - Port mapped the code-server to 19000, 19001, 19002 - Suggested by ChatGPT - Doesn't work
   - Probable Solution: 
     - `inotifywait`(Google this) - This doesn't seem to work for any file in /tmp/bolty-worker directory but it works for any file in other directories

- Code Server: Streaming file changes to frontend (Just like Bolt does) - This is trickier in code-server as we maybe need to create a custom vscode extension to open the files in code-server as it is being changed/updated by the worker just like [Harkirat](https://www.youtube.com/watch?v=4JdUPCT37fI) does
  - Probable Solution: 
    - Create a custom vscode extension to open the files in code-server as it is being changed/updated by the worker - [Reference](https://youtu.be/4JdUPCT37fI?t=7389)
    - Changing the architecture of the project to use monaco, xterm(Pseudo Terminal), etc instead of code-server (Syncing files between code-server, worker and frontend(to show file structure) is going to be difficult)
