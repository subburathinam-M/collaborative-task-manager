# 🚀 Collaborative Task Manager

A full-stack web application for managing tasks within a team, featuring **role-based access control**, **real-time task updates**, and an intuitive **dashboard UI with dark mode**.

---

## 📍 Features

### 👥 Authentication & Roles
- Secure JWT-based login/signup
- Two user roles:
  - **Manager** → create, assign & delete tasks
  - **User** → view & update status of assigned tasks

### 📌 Task Management
- Create tasks with description, deadline & priority
- Assign tasks to users
- Update task status (`todo → in_progress → done`)
- Manager can delete tasks

### 💬 Real-time Features
- Automatic task refresh using **Socket.io**
- Instant update across users when tasks are created/updated/deleted

### 🎨 Frontend Experience
- Beautiful dashboard using **React + Tailwind CSS**
- **Dark / Light mode** support
- Drag-and-drop task board (optional — replaceable with dropdown)
- Fully responsive

---

## 🧰 Tech Stack

| Part | Technology |
|------|------------|
| Frontend | React, Vite, Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Token (JWT) |
| Real-Time | Socket.io |
| Security | Rate limiting, bcrypt password hashing |

---

## 📂 Project Structure

```
collaborative-task-manager/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```
---

## 🔧 Setup Instructions (Run Project Locally)

### 1️⃣ Clone repository
```bash
git clone https://github.com/subburathinam-M/collaborative-task-manager.git
cd collaborative-task-manager

### 2️⃣ Backend Setup

cd backend
npm install

# Create .env inside backend

PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=SOME_STRONG_SECRET

# Start backend server

npm run dev

Backend will start on:

http://localhost:5000

3️⃣ Frontend Setup

Open a new terminal:

cd frontend
npm install

Optional .env (only if backend deployed)
VITE_API_URL=https://YOUR_BACKEND_URL

Start frontend
npm run dev


# Frontend will start on:

http://localhost:5173

## 🔐 Demo Credentials (Suggested for HR)

| Role    | Email                                         | Password |
| ------- | --------------------------------------------- | -------- |
| Manager | [manager@gmail.com](mailto:manager@gmail.com) | 123456   |
| User    | [demo@gmail.com](mailto:demo@gmail.com)       | 123456   |

(Modify based on your actual database values)

## 📌 API Endpoints Summary

| Method | Endpoint                       | Access                                |
| ------ | ------------------------------ | ------------------------------------- |
| POST   | `/api/auth/signup`             | Public                                |
| POST   | `/api/auth/login`              | Public                                |
| GET    | `/api/tasks?assignedToMe=true` | User / Manager                        |
| GET    | `/api/tasks?createdByMe=true`  | Manager                               |
| POST   | `/api/tasks`                   | Manager                               |
| PUT    | `/api/tasks/:id`               | Manager / Assigned User (status only) |
| DELETE | `/api/tasks/:id`               | Manager                               |

## 🧠 Role-Based Permissions

| Action                      | Manager | User            |
| --------------------------- | ------- | --------------- |
| Login                       | ✔       | ✔               |
| Create task                 | ✔       | ✖               |
| Assign task                 | ✔       | ✖               |
| Update any task data        | ✔       | ✖               |
| Update only task status     | ✔       | ✔ (if assigned) |
| Delete task                 | ✔       | ✖               |
| View tasks assigned to self | ✔       | ✔               |
| View tasks created by self  | ✔       | ✖               |


### 🏁 Conclusion

This project demonstrates:

Full-stack development

Secure authentication

Role-based access control

Socket.io integrations

State management + responsive UI


