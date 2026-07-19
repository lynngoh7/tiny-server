# Task API

A small in-memory CRUD API for managing a to-do list, built with Node.js and Express.

## Features
- Full CRUD (Create, Read, Update, Delete) on tasks
- In-memory storage (no database — data resets when the server restarts)
- Interactive API docs via Swagger UI

## Installation & Running

### Option 1: Docker Compose (recommended — starts app + database together)

1. Clone this repo:
```bash
   git clone https://github.com/lynngoh7/tiny-server.git
   cd tiny-server
```

2. Create a `.env` file based on the example:
```bash
   cp .env.example .env
```

3. Start the full stack:
```bash
   docker compose up
```

4. The app runs at `http://localhost:3000`, and Postgres runs at `localhost:5432`.
   Tables and seed data are created automatically on first run via `db/init.sql`.

5. To stop everything:
```bash
   docker compose down
```
   (Data persists in a Docker volume — running `docker compose up` again will still have your data. Add `-v` to `down` if you want to wipe the database entirely.)

### Option 2: Run the app locally, Postgres in Docker

1. Start Postgres only:
```bash
   docker run --name tasks-postgres \
     -e POSTGRES_USER=taskuser \
     -e POSTGRES_PASSWORD=taskpass \
     -e POSTGRES_DB=tasksdb \
     -p 5432:5432 \
     -v tasks-pgdata:/var/lib/postgresql \
     -d postgres
```

2. Load the schema and seed data:
```bash
   docker exec -i tasks-postgres psql -U taskuser -d tasksdb < db/init.sql
```

3. Install dependencies and start the app:
```bash
   npm install
   node server.js
```

4. The app runs at `http://localhost:3000`.

## Endpoints

| Method | Path         | Description                  | Success | Errors        |
|--------|--------------|-------------------------------|---------|---------------|
| GET    | `/`          | API info                     | 200     | —             |
| GET    | `/health`    | Health check                 | 200     | —             |
| GET    | `/tasks`     | List all tasks               | 200     | —             |
| GET    | `/tasks/:id` | Get a single task            | 200     | 404           |
| POST   | `/tasks`     | Create a new task            | 201     | 400           |
| PUT    | `/tasks/:id` | Update a task                | 200     | 400, 404      |
| DELETE | `/tasks/:id` | Delete a task                | 204     | 404           |

## Example request

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'
```

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 40
ETag: W/"28-PpSBYV7i68cXyGc7AhjVpkZkY5Q"
Date: Thu, 16 Jul 2026 03:34:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":4,"title":"Buy milk","done":false}
```

## Swagger UI

Interactive docs are available at `http://localhost:3000/docs` once the server is running.

![Swagger UI screenshot](swagger-screenshot.png)

## Persistence

Verified by:
1. Creating a task via `POST /tasks`
2. Running `docker compose down` (stops and removes containers, but not the named volume)
3. Running `docker compose up` again
4. Confirming via `GET /tasks` that the task was still present

This works because Postgres's data directory is mounted to a named Docker volume (`tasks-pgdata`), which persists independently of the container's lifecycle.

## Architecture note

The in-memory task store was replaced with a Postgres-backed repository (`taskRepository.js`). The Express routes and service logic in `server.js` did not change — only the storage layer underneath was swapped, proving the separation between routes and storage.