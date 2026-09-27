# Academic Student Registry

Static student registration form with a Node.js API and MySQL persistence.

## Requirements

- Node.js 20 or later
- MySQL 8 or a compatible MariaDB server

## Database setup

Create the database and an application user in MySQL:

```sql
CREATE DATABASE academic_registry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'academic_app'@'localhost' IDENTIFIED BY 'Academic@123';
ALTER USER 'academic_app'@'localhost' IDENTIFIED BY 'Academic@123';
GRANT SELECT, INSERT, CREATE ON academic_registry.* TO 'academic_app'@'localhost';
```

Install the Node.js driver, configure the connection, and start the application:

# Start MySQL if it is installed as a system service:
# sudo systemctl enable --now mysql
# sudo systemctl status mysql


```sh
npm install
export MYSQL_HOST="127.0.0.1"
export MYSQL_PORT="3306"
export MYSQL_USER="academic_app"
export MYSQL_PASSWORD="Academic@123"
export MYSQL_DATABASE="academic_registry"
npm start
```

Open `http://127.0.0.1:3000`. The server creates the `students` table and unique indexes at startup. Identification and email uniqueness is case-insensitive. The page and API share the same origin.

The server binds to `127.0.0.1` by default and has no authentication. Before exposing it on a network, add authentication and authorization and configure an appropriate host and network policy.

Existing MongoDB records are not copied automatically; export and migrate them separately if they need to be retained.

## Tests

The project separates production code and tests by responsibility:

- `src/frontend`: page and browser-facing assets.
- `src/backend`: HTTP server and MySQL repository.
- `src/shared`: validation and age calculation shared by frontend and backend.
- `tests/unit`: isolated business-logic tests.
- `tests/api`: HTTP API tests with an in-memory repository.
- `tests/frontend`: Cypress browser tests and Page Object Model.
- `tests/accessibility`: Playwright accessibility smoke tests.

Run the test categories independently:

```sh
npm run test:unit
npm run test:api
npm run test:frontend
npm run test:accessibility
npm run test:e2e:visual
```

The Cypress suite uses Page Object Model under `tests/frontend/pages` and acceptance specs under `tests/frontend`. It intercepts the student API so browser tests are repeatable and do not add test records to MySQL. Start the app at `http://127.0.0.1:3000` before the frontend or accessibility commands. `npm run test:frontend` runs Cypress in the terminal; `npm run test:e2e:visual` opens Cypress Runner. The app still needs a reachable MySQL database and the `MYSQL_*` variables above.

Run all unit, API, and functional checks with `npm run test:ci`; it starts the app, waits for `/api/health`, runs Cypress, and stops the app. In a CI pipeline, provide a MySQL service and the `MYSQL_*` environment variables before running that command. Use `npm run cypress:open` to develop tests interactively against the configured base URL.# qa_ia
