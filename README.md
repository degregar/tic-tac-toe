
## About the project

This project is a web application for the classic Tic-Tac-Toe game, featuring a login mechanism and online game initiation.

More information about the project can be found in the [TASK.md](TASK.md) file.

Demo: [https://ttt-demo.kukla.tech](https://ttt-demo.kukla.tech)

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Run `docker-compose up -d` to start the databases.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the development server.
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Postgres locally

You can use `adminer` to view the database at [http://localhost:8080](http://localhost:8080).

## Running tests
1. Copy `.env.test.example` to `.env.test` and fill in the values.
2. Run `docker-compose -f docker-compose.test.yml up -d` to start the databases.
3. Run `npm run test` to run the tests.

## Architecture

### Tech Stack
The project is built using the following technologies:
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Jest](https://jestjs.io/) - Testing framework
- [Redis](https://redis.io/) - In-memory database
- [Socket.IO](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Docker](https://www.docker.com/) - Containerization
- [Docker Compose](https://docs.docker.com/compose/) - Container orchestration

### Overview

Events sent via WebSockets are used to communicate between the server and the client.

We use Redis to store the queue of players and game states, and PostgreSQL to store games history.

We log in user using JWT tokens, which are stored in the browser's local storage.

We don't require passing any user data to the server, except for the JWT token, which is used to identify the user. New accounts are created automatically when logging in for the first time.

Main business logic is to be found in `src/lib/game/server/game-events-resolver.ts`
