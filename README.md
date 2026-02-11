**Project Description**

- **What it does:** A simple authentication and user management application. The backend provides REST APIs for user registration, login, profile, and basic dashboard data. The web client is a Vite + React front-end that consumes the backend APIs.

**Tech Stack**

- **Backend:** Java Spring Boot (Maven)
- **Database:** MySQL
- **Web:** React (Vite)
- **JS tooling:** Node.js, npm

**Quick Links**

- Backend config: [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties)
- API helper (web): [web/src/utils/api.js](web/src/utils/api.js#L1)
- Backend controllers: [backend/src/main/java/com/example/backend/controller/AuthController.java](backend/src/main/java/com/example/backend/controller/AuthController.java#L1) and [backend/src/main/java/com/example/backend/controller/UserController.java](backend/src/main/java/com/example/backend/controller/UserController.java#L1)

**How to run the backend**

Prerequisites: Java 17+ (or the version the project targets), Maven (or use the included Maven wrapper), and a running MySQL server.

From the project root, run the backend server (Windows PowerShell):

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Or on macOS / Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Build a runnable jar and run:

```bash
cd backend
./mvnw package
java -jar target/*.jar
```

The backend defaults to port `8080` (see application properties).

**How to run the web client**

Prerequisites: Node.js (16+) and npm.

Start the web client (from project root):

```bash
cd web
npm install
npm run dev
```

The web client uses `http://localhost:8080/api` as the API base by default (see [web/src/utils/api.js](web/src/utils/api.js#L1)).

**How to run mobile (optional)**

This repository does not include a mobile app. To create a mobile client that talks to the same API, you can scaffold a React Native / Expo app and point its API client to the backend base URL:

Example (Expo):

```bash
npx create-expo-app mobile
cd mobile
npm install
# create an API helper using the same base URL: http://localhost:8080/api
```

On a device or emulator, set the API host to your machine's IP (e.g., `http://192.168.1.100:8080/api`) because `localhost` inside the phone/emulator won't map to your PC.

**Database setup (MySQL)**

Default DB config is in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties). By default the project expects a MySQL database named `auth_db`.

Create the database and table manually (example SQL):

```sql
CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_db;

CREATE TABLE IF NOT EXISTS users (
	user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	fullname VARCHAR(255),
	password_hash VARCHAR(255) NOT NULL
);
```

Import via mysql CLI:

```bash
mysql -u root -p < schema.sql
```

Note: The application is configured with `spring.jpa.hibernate.ddl-auto=update`, which will create/update tables automatically on startup. For production, prefer managing schema with migrations (Flyway/Liquibase) and set `ddl-auto` appropriately.

**Environment variables / config notes**

- Change DB credentials and URL in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties). Key properties:

	- `spring.datasource.url` — JDBC URL (e.g., `jdbc:mysql://localhost:3306/auth_db`)
	- `spring.datasource.username` — DB user
	- `spring.datasource.password` — DB password
	- `server.port` — backend port (default `8080`)

- Web client API base URL default is in [web/src/utils/api.js](web/src/utils/api.js#L1). Update `API_BASE_URL` if the backend is hosted elsewhere.

**List of API endpoints**

Auth endpoints (controller: `AuthController`)

- `POST /api/auth/register` — Register a new user. Expects `RegisterRequest` JSON (username, email, password, etc.). Returns AuthResponse with token.
- `POST /api/auth/login` — Login with credentials. Returns AuthResponse with token.
- `GET /api/auth/dashboard/{username}` — Get dashboard data for `username` (requires auth token).
- `GET /api/auth/profile/{username}` — Get profile data for `username` (requires auth token).
- `POST /api/auth/logout` — Logout (accepts `Authorization` header with token).

User endpoints (controller: `UserController`)

- `GET /api/users` — List all users (returns limited user info).
- `POST /api/users` — Create a user. Expects `CreateUserRequest` JSON. Returns created user.
- `GET /api/users/{id}` — Get user by numeric id.
- `GET /api/users/username/{username}` — Get user by username.
- `PUT /api/users/{id}` — Update user fields.
- `DELETE /api/users/{id}` — Delete user by id.

Authentication: Some endpoints expect an `Authorization: Bearer <token>` header. Tokens are returned by the auth endpoints.

**Troubleshooting & notes**

- If the backend fails to start due to DB errors, confirm MySQL is running and `spring.datasource.*` values are correct.
- To change the API base used by the web app, update [web/src/utils/api.js](web/src/utils/api.js#L1).
- For development convenience the project uses `spring.jpa.hibernate.ddl-auto=update`. Be cautious using this setting in production.

**Where to look in the code**

- Backend main: [backend/src/main/java/com/example/backend/BackendApplication.java](backend/src/main/java/com/example/backend/BackendApplication.java)
- Auth controller: [backend/src/main/java/com/example/backend/controller/AuthController.java](backend/src/main/java/com/example/backend/controller/AuthController.java#L1)
- User controller: [backend/src/main/java/com/example/backend/controller/UserController.java](backend/src/main/java/com/example/backend/controller/UserController.java#L1)
- Web API helper: [web/src/utils/api.js](web/src/utils/api.js#L1)
