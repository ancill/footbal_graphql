GraphQL Import League Implementation
==============

This project is a GraphQL server that retrieves data from the [Football Data API](http://www.football-data.org/) and stores it in a PostgreSQL database using [Prisma](https://www.prisma.io/). The server is built with [Fastify](https://www.fastify.io/) and [Mercurius](https://mercurius.dev/) and uses [GraphQL Scalars](https://github.com/Urigo/graphql-scalars) to handle custom scalar types.

Getting Started
---------------

To run this project, you'll need to have [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/) installed on your machine.

1. Clone the repository
2. Create a `.env` file in the root directory and set the `FOOTBALL_API_TOKEN` variable to your Football Data API token
3. Run `docker-compose up` to start the PostgreSQL database
4. Run `pnpm install` to install the dependencies
5. Run `pnpm run reset` to create the schema and seed the database
6. Run `pnpm run dev` to start the server

The server will be running on `http://localhost:4000/graphql`.

Environment Variables
---------------------

The following environment variables can be set to configure the API:

* `FOOTBALL_API_TOKEN`: Your [football-data.org](http://www.football-data.org/) API token.

* `DATABASE_URL`: The URL of the PostgreSQL database. The default value is `"postgresql://sammy:your_password@localhost:5432/my-blog?schema=public"`.

Scripts
-------

* `npm start` - starts the server
* `npm run dev` - starts the server in development mode with automatic reloading using `ts-node-dev`
* `npm run dev:debug` - starts the server in development mode with debugging enabled
* `npm run studio` - opens the Prisma studio for exploring the database
* `npm run reset` - recreates the schema and seeds the database
* `npm run db-seed` - seeds the database with data
* `npm run build` - builds the project to the `dist` directory
* `npm run lint` - runs ESLint on the project
* `npm run format` - formats the code using Prettier

Dependencies
------------

* `@graphql-tools/schema` - tool for building GraphQL schemas
* `@prisma/client` - Prisma client for accessing the database
* `axios` - Promise based HTTP client for making API requests
* `fastify` - web framework for building fast servers
* `graphql` - query language for APIs
* `graphql-scalars` - library of custom scalar types for GraphQL
* `mercurius` - plugin for Fastify that adds support for GraphQL

Dev Dependencies
----------------

* `@types/node` - TypeScript type definitions for Node.js
* `prisma` - ORM for working with databases
* `ts-node` - TypeScript execution and REPL for Node.js
* `ts-node-dev` - development tool that automatically restarts the Node.js process
* `typescript` - programming language that extends JavaScript

Database
--------

This project uses PostgreSQL as the database. The database is configured using Docker Compose in the `docker-compose.yml` file. The schema is managed using Prisma, and the data is seeded using a script in the `prisma/seed.ts` file.

The `reset` script recreates the schema and seeds the database with data. If you want to seed the database with additional data, you can modify the `prisma/seed.ts` file and run the `db-seed` script.

API
---

The GraphQL API has two endpoints:

* `/graphql` - the main GraphQL endpoint
* `/graphql/playground` - a web-based IDE for exploring the API

### Queries

* `players(leagueCode: String!, teamName: String): [Player!]!` - retrieves a list of players for all teams in a given league. If a team name is provided, the list is filtered to include only players for that team.  If the given leagueCode is not present in the DB, it should respond with an error message.

* `team(name: String!, withPlayers: Boolean = false): Team` - takes a name and returns the corresponding team. Additionally, if requested in the query, it should resolve the players for that team (or coaches, if players are not available at the moment of implementation).

___

### Made by [Ivan Arsenev](https://github.com/ancill)
