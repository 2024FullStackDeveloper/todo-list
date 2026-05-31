# ✅ Todo List API

A robust RESTful API for managing tasks and user accounts, built with **NestJS**, **TypeORM**, and **PostgreSQL**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
  - [Authentication](#authentication)
  - [Profile](#profile)
  - [Task Types](#task-types)
- [API Response Format](#-api-response-format)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Database Migrations](#-database-migrations)
- [Database Seeding](#-database-seeding)
- [Scripts](#-scripts)
- [License](#-license)

---

## ✨ Features

- **User Registration & Login** — Sign up and authenticate with JWT-based tokens
- **Token Refresh** — Obtain new access tokens using refresh tokens
- **Password Reset via OTP** — Request an OTP email and reset your password securely
- **Profile Management** — View and update your own profile
- **Task Management** — Tasks with title, description, priority levels (`low`, `medium`, `high`, `urgent`), due dates, completion status, and automatic `completedAt` timestamp tracking
- **Advanced Filtering & Pagination** — Search tasks by text, filter by status or priority, use dynamic multi-column sorting, and receive comprehensive pagination metadata
- **Secure Scoped Task Types** — Full CRUD for task categories scoped perfectly to the authenticated user. Includes unique name enforcement, freeze protection to prevent modification/deletion of system types, and active/inactive toggling
- **Internationalization** — Full i18n support for English (`en`) and Arabic (`ar`)
- **Standardized API Responses** — Consistent JSON envelope for all endpoints, now including structured pagination metadata
- **Zod Validation** — Request body and query parameter validation using Zod schemas via `nestjs-zod`
- **Event-Driven Architecture** — Uses `@nestjs/event-emitter` for decoupled email notifications (welcome emails, OTP codes)
- **Auto Migrations** — Migrations automatically check for existing schemas and run safely on application startup
- **Database Seeding** — Admin user and primary task types are seeded automatically
- **Global Exception Filter** — Centralized error handling with translated messages
- **URI Versioning** — All endpoints are versioned under `/api/v1/`

---

## 🛠 Tech Stack

| Layer          | Technology                                                      |
| -------------- | --------------------------------------------------------------- |
| Framework      | [NestJS](https://nestjs.com/) v11                               |
| Language       | [TypeScript](https://www.typescriptlang.org/) v5                |
| Database       | [PostgreSQL](https://www.postgresql.org/)                       |
| ORM            | [TypeORM](https://typeorm.io/) v1                               |
| Validation     | [Zod](https://zod.dev/) v4 + [nestjs-zod](https://github.com/risen228/nestjs-zod) |
| Authentication | [JWT](https://jwt.io/) via `@nestjs/jwt`                        |
| Hashing        | [bcrypt](https://github.com/kelektiv/node.bcrypt.js)            |
| Email          | [Nodemailer](https://nodemailer.com/) via `@nestjs-modules/mailer` |
| i18n           | [nestjs-i18n](https://nestjs-i18n.com/)                        |
| Events         | `@nestjs/event-emitter`                                         |
| Testing        | [Jest](https://jestjs.io/) + [Supertest](https://github.com/visionmedia/supertest) |

---

## 📁 Project Structure

```
src/
├── main.ts                          # Application bootstrap
├── app.module.ts                    # Root module
│
├── common/                          # Shared utilities & infrastructure
│   ├── constrants/                  # Event name constants
│   ├── decorators/                  # Custom decorators (@Auth, @User)
│   ├── enums/                       # Result status enums
│   ├── filters/                     # Global exception filter
│   ├── guards/                      # JWT AuthGuard
│   ├── interceptors/                # Response transformation interceptor
│   ├── interfaces/                  # Result, ApiResponse, Validation interfaces
│   ├── modules/                     # CoreModule (global providers)
│   ├── pipes/                       # Custom pipes
│   ├── services/                    # Bcrypt, OTP, Result services
│   └── utils/                       # Utility scripts
│
├── database/
│   ├── base/                        # BaseEntity (createdAt, updatedAt)
│   ├── migrations/                  # TypeORM migrations
│   ├── seeds/                       # Admin user seed
│   ├── transformers/                # Column transformers (lowercase)
│   ├── data-source.ts               # TypeORM DataSource config
│   ├── database-seeder.module.ts    # Seeder module
│   ├── database-seeder.service.ts   # Seeder service
│   └── run-migrations.ts            # Auto-run migrations on startup
│
├── i18n/
│   ├── en/                          # English translations
│   │   ├── errors.json
│   │   └── messages.json
│   └── ar/                          # Arabic translations
│       ├── errors.json
│       └── messages.json
│
└── modules/
    ├── auth/                        # Authentication module
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.module.ts
    │   ├── dto/                     # LoginDto, RegisterDto, ResetPasswordDto, ChangePasswordDto
    │   ├── events/                  # SendOtpEvent, RegisterEvent
    │   ├── interfaces/              # IAuthService, LoginResponse, RefreshTokenResponse
    │   └── constants/
    │
    ├── users/                       # Users module (internal service)
    │   ├── users.service.ts
    │   ├── users.module.ts
    │   ├── models/                  # User entity
    │   └── interfaces/              # IUserService
    │
    ├── profile/                     # Profile module
    │   ├── profile.controller.ts
    │   ├── profile.service.ts
    │   ├── profile.module.ts
    │   ├── dto/                     # UpdateProfileDto
    │   └── interfaces/              # IProfile
    │
    └── task/                        # Task module
        ├── task.controller.ts       # Task Types CRUD endpoints
        ├── task.service.ts          # Task Types business logic
        ├── task.module.ts
        ├── dto/                     # CreateTaskTypeDto, UpdateTaskTypeDto
        ├── interfaces/              # ITask, TaskTypeResponse
        ├── models/                  # Task & TaskTypes entities
        ├── enums/                   # Priority enum (low, medium, high, urgent)
        └── constrants/              # Injection token constants
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** ≥ 14

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd todo-list

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=todo_list_db

# Bcrypt
BCRYPT_SALT=10

# Seed Data (Admin User)
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin@@@123

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE_IN=3600
JWT_REFRESH_EXPIRE_IN=7d

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_app_password
```

> 💡 **Tip:** Generate a secure JWT secret with `npm run generate:secret`

### Database Setup

Make sure PostgreSQL is running and a database named `todo_list_db` (or the value of `DB_NAME`) exists:

```sql
CREATE DATABASE todo_list_db;
```

Migrations and seeding run **automatically** when the application starts.

### Running the App

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api/v1/`.

---

## 📡 API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint                           | Auth | Description                       |
| ------ | ---------------------------------- | ---- | --------------------------------- |
| `POST` | `/api/v1/auth/register`            | No   | Register a new user               |
| `POST` | `/api/v1/auth/login`               | No   | Login and receive JWT tokens      |
| `GET`  | `/api/v1/auth/refresh`             | Yes  | Refresh access & refresh tokens   |
| `POST` | `/api/v1/auth/reset-password/send-otp` | No   | Send OTP code to email        |
| `POST` | `/api/v1/auth/reset-password/change`   | No   | Change password with OTP      |

#### `POST /api/v1/auth/register`

```json
{
  "firstName": "Abbas",
  "lastName": "Alburaee",
  "email": "user@example.com",
  "password": "mypassword"
}
```

#### `POST /api/v1/auth/login`

```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

#### `POST /api/v1/auth/reset-password/send-otp`

```json
{
  "email": "user@example.com"
}
```

#### `POST /api/v1/auth/reset-password/change`

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "mynewpassword"
}
```

---

### Profile

| Method | Endpoint           | Auth | Description             |
| ------ | ------------------ | ---- | ----------------------- |
| `GET`  | `/api/v1/profile`  | Yes  | Get current user profile|
| `PUT`  | `/api/v1/profile`  | Yes  | Update current user profile |

> **Auth:** Include the header `Authorization: Bearer <access_token>`

---

### Task Types

| Method   | Endpoint                     | Auth | Description              |
| -------- | ---------------------------- | ---- | ------------------------ |
| `GET`    | `/api/v1/tasks/task-types`     | Yes  | List all task types      |
| `POST`   | `/api/v1/tasks/task-types`     | Yes  | Create a new task type   |
| `GET`    | `/api/v1/tasks/task-types/:id` | Yes  | Get a task type by ID    |
| `PUT`    | `/api/v1/tasks/task-types/:id` | Yes  | Update a task type       |
| `DELETE` | `/api/v1/tasks/task-types/:id` | Yes  | Delete a task type       |

> **Auth:** Include the header `Authorization: Bearer <access_token>`

> **Note:** Task types with `freeze: true` cannot be updated or deleted. Attempting to do so returns a `400 Bad Request`.

#### `POST /api/v1/tasks/task-types`

```json
{
  "name": "Bug Fix",
  "description": "Tasks related to bug fixes",
  "isActive": true
}
```

| Field         | Type      | Required | Description                          |
| ------------- | --------- | -------- | ------------------------------------ |
| `name`        | `string`  | Yes      | Unique name for the task type        |
| `description` | `string`  | No       | Optional description                 |
| `isActive`    | `boolean` | No       | Whether the type is active (default `true`) |

#### `PUT /api/v1/tasks/task-types/:id`

```json
{
  "description": "Updated description",
  "isActive": false
}
```

| Field         | Type      | Required | Description                          |
| ------------- | --------- | -------- | ------------------------------------ |
| `description` | `string`  | No       | Updated description                  |
| `isActive`    | `boolean` | No       | Toggle active status                 |

> **Note:** The `name` field cannot be changed after creation.

#### Task Type Response

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Bug Fix",
  "description": "Tasks related to bug fixes",
  "isActive": true,
  "createdAt": "2026-05-28T21:00:00.000Z",
  "updatedAt": "2026-05-28T21:00:00.000Z"
}
```

---

### Tasks

| Method   | Endpoint                     | Auth | Description                           |
| -------- | ---------------------------- | ---- | ------------------------------------- |
| `GET`    | `/api/v1/tasks`                | Yes  | Search and paginate tasks             |
| `POST`   | `/api/v1/tasks`                | Yes  | Create a new task                     |
| `GET`    | `/api/v1/tasks/:id`            | Yes  | Get a task by ID                      |
| `PUT`    | `/api/v1/tasks/:id`            | Yes  | Update a task                         |
| `DELETE` | `/api/v1/tasks/:id`            | Yes  | Delete a task                         |

#### `GET /api/v1/tasks` (Filtering & Pagination)

Accepts query parameters for advanced searching, filtering, sorting, and pagination:

| Query Param | Type      | Description                                           |
| ----------- | --------- | ----------------------------------------------------- |
| `page`      | `number`  | Page number (default: 1)                              |
| `limit`     | `number`  | Items per page (default: 10, max: 100)                |
| `search`    | `string`  | Global text search in `title` or `description`        |
| `sort`      | `string`  | Dynamic multi-sorting (e.g., `createdAt:DESC,priority:ASC`) |
| `priority`  | `enum`    | Filter by priority (`low`, `medium`, `high`, `urgent`)|
| `isCompleted`| `boolean`| Filter by completion status                           |
| `taskTypeId`| `uuid`    | Filter by a specific task type ID                     |
| `dueDate`   | `date`    | Filter by specific due date                           |
| `completedAt`| `date`   | Filter by specific completion date                    |

Returns a paginated response including `data` (tasks) and `meta` (pagination info: `itemCount`, `pageCount`, `hasPreviousPage`, `hasNextPage`).

---

## 📦 API Response Format

All responses follow a standardized JSON envelope:

```json
{
  "timestamp": 42,
  "statusCode": 200,
  "status": "success",
  "details": {
    "type": "toast",
    "message": "Operation completed successfully"
  },
  "data": { ... },
  "path": "/api/v1/auth/login"
}
```

| Field              | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `timestamp`        | Response time in milliseconds                                               |
| `statusCode`       | HTTP status code                                                            |
| `status`           | `"success"` or `"error"`                                                    |
| `details.type`     | `"toast"` for simple messages, `"modal"` for content, `"field"` for validation errors |
| `details.message`  | Translated human-readable message                                           |
| `details.validations` | Array of field-level validation errors (when applicable)                |
| `data`             | Response payload (or `null`). For paginated responses, contains `data` array and `meta` object. |
| `path`             | The requested endpoint path                                                 |

---

## 🌐 Internationalization (i18n)

The API supports multiple languages. Set the `Accept-Language` header to switch:

```
Accept-Language: en    # English (default)
Accept-Language: ar    # Arabic
```

All error messages, validation messages, and success messages are translated.

---

## 🗄 Database Migrations

Migrations run automatically on startup via `run-migrations.ts`. To manage them manually:

```bash
# Generate a new migration
npm run migration:generate

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

---

## 🌱 Database Seeding

An admin user is automatically seeded on the first run if the `users` table is empty. Configure the admin credentials through the `ADMIN_*` environment variables.

To run seeds manually via the TypeORM extension CLI:

```bash
npm run seed:run
```

---

## 📜 Scripts

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run start`        | Start the application                          |
| `npm run start:dev`    | Start in watch mode (development)              |
| `npm run start:debug`  | Start in debug + watch mode                    |
| `npm run start:prod`   | Start the production build                     |
| `npm run build`        | Compile the project                            |
| `npm run lint`         | Lint and auto-fix source files                 |
| `npm run format`       | Format source files with Prettier              |
| `npm run test`         | Run unit tests                                 |
| `npm run test:watch`   | Run unit tests in watch mode                   |
| `npm run test:cov`     | Run tests with coverage report                 |
| `npm run test:e2e`     | Run end-to-end tests                           |
| `npm run migration:generate` | Generate a TypeORM migration              |
| `npm run migration:run`     | Run pending migrations                    |
| `npm run migration:revert`  | Revert the last migration                 |
| `npm run seed:run`     | Run database seeds                             |
| `npm run generate:secret` | Generate a secure secret key                |

---

## 📄 License

This project is **UNLICENSED** — private and proprietary.
