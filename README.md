```bash
npm install
```


# Task Management System — MERN Stack

A practical interview-ready full-stack task management application built with MongoDB, Express.js, React.js and Node.js.

## Features

- User registration and login
- JWT authentication
- Password hashing with bcryptjs
- Protected task APIs
- Create, read, update and delete tasks
- Task status and priority
- Due dates
- Search and filtering
- Dashboard task statistics
- Responsive React UI

## Project structure

```text
Task-Management-System/
├── backend/
└── frontend/
```

## Requirements

- Node.js 20+
- npm
- MongoDB local installation or a MongoDB Atlas connection

## 1. Start MongoDB

For local MongoDB, make sure the MongoDB service is running.

## 2. Backend setup

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Edit `.env` and set a strong `JWT_SECRET` if needed.

Backend: http://localhost:5000
Health check: http://localhost:5000/api/health

## 3. Frontend setup

Open a second terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173

## MongoDB Atlas

Replace `MONGODB_URI` in `backend/.env` with your Atlas connection string.

## Main API endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Tasks

- GET `/api/tasks`
- POST `/api/tasks`
- GET `/api/tasks/:id`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- GET `/api/tasks/stats`

## Interview flow to explain

React UI → Axios → Express route → JWT middleware → controller → Mongoose → MongoDB.

The backend always uses the authenticated user's ID when reading, updating or deleting tasks, so one user cannot access another user's tasks through the normal task endpoints.
