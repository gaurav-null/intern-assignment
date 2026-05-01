<div align="center">

#  Backend Developer Intern Assignment


[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

</div>

---

##  Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Run with Docker](#run-with-docker-recommended)
  - [Run Locally](#run-locally-without-docker)
- [API Reference](#-api-reference)
  - [Auth Endpoints](#auth-endpoints-apiv1auth)
  - [Todo Endpoints](#todo-endpoints-apiv2todos)
- [API Versioning](#-api-versioning)

---

##  Overview

This project is a full-stack web application built to demonstrate backend engineering best practices. It features user authentication with JWT stored in HTTP-only cookies, protected routes, CRUD operations for a `todos` resource, and a versioned API design — all wired up to a React frontend for easy interaction.

---

##  Features

<table>
<tr>
<td width="33%" valign="top">

###  Backend
- User registration & login
- Password hashing with **bcrypt**
- **JWT** auth via HTTP-only cookies
- Protected user profile route
- **Versioned REST APIs** (`v1`, `v2`)
- Full **Todo CRUD** operations
- **PostgreSQL** database integration
- Centralized error handling
- Input validation on auth endpoints
- CORS configured for frontend

</td>
<td width="33%" valign="top">

###  Frontend
- **React** + **Vite** based UI
- Register and login screens
- Protected dashboard for auth users
- Todo list with create, update, delete & fetch
- Success & error message handling
- Full API integration via **Axios**

</td>
<td width="33%" valign="top">

###  Deployment
- Dockerized **backend**
- Dockerized **frontend** (served via Nginx)
- **PostgreSQL** container
- One-command startup with **Docker Compose**

</td>
</tr>
</table>

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Authentication** | JWT, bcrypt |
| **Frontend** | React, Vite, Axios |
| **Deployment** | Docker, Docker Compose |

---

##  Project Structure

```
intern-assignment/
├── backend/
│   ├── config/              # Database & environment config
│   ├── middleware/          # Auth middleware
│   ├── model/               # Database models
│   ├── routes/
│   │   ├── v1/              # Auth routes (v1)
│   │   └── v2/              # Todo routes (v2)
│   ├── .env.example
│   ├── Dockerfile
│   ├── .dockerignore
│   └── server.js
├── db/
│   └── init.sql             # Database initialization script
├── frontend/
│   ├── src/                 # React source files
│   ├── Dockerfile
│   ├── nginx.conf           # Nginx config for serving the app
│   ├── .dockerignore
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

---

##  Getting Started

### Run with Docker *(Recommended)*

> **Prerequisites:** [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

**Start the application**
```bash
docker compose up --build
```

**Stop the application**
```bash
docker compose down
```

**Stop and remove volumes** *(wipes the database)*
```bash
docker compose down -v
```

Once running, the frontend is accessible at `http://localhost:5173` and the backend API at `http://localhost:3000`.

---

### Run Locally Without Docker

**Backend**
```bash
cd backend
npm install
npm start
```

**Frontend** *(in a separate terminal)*
```bash
cd frontend
npm install
npm run dev
```

> Make sure to copy `.env.example` to `.env` in the `backend/` directory and fill in your local PostgreSQL credentials before starting.

---

##  API Reference

###  API Versioning

| Resource | Base Path |
|---|---|
| Auth APIs | `/api/v1/auth` |
| Todo APIs | `/api/v2/todos` |

---

### Auth Endpoints `/api/v1/auth`

#### `POST` Register a new user

```
POST /api/v1/auth/register
```

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

---

#### `POST` Login

```
POST /api/v1/auth/login
```

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

---

#### `POST` Logout

```
POST /api/v1/auth/logout
```

*Clears the authentication cookie.*

---

#### `GET` Get current user

```
GET /api/v1/auth/me
```

*Requires authentication. Returns the profile of the currently logged-in user.*

---

### Todo Endpoints `/api/v2/todos`

> All todo endpoints require authentication.

#### `POST` Create a todo

```
POST /api/v2/todos
```

**Request body:**
```json
{
  "title": "Study for interview",
  "description": "Revise Node.js and SQL"
}
```

---

#### `GET` Get all todos

```
GET /api/v2/todos
```

*Returns all todos belonging to the authenticated user.*

---

#### `PUT` Update a todo

```
PUT /api/v2/todos/:id
```

**Request body:**
```json
{
  "title": "Study for interview",
  "description": "Revise Node.js, SQL, and Docker",
  "completed": true
}
```

---

#### `DELETE` Delete a todo

```
DELETE /api/v2/todos/:id
```

*Deletes the todo with the specified ID.*

---

<div align="center">


</div>