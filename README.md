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

'''
Collaborative-Task-Manager/
│
├── backend/
│ ├── src/
│ ├── .env
│ ├── package.json
│ └── ...
│
└── frontend/
├── src/
├── .env (optional)
├── package.json
└── ...

'''

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
'''
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=SOME_STRONG_SECRET
'''

# Start backend server
'''
npm run dev
'''





## 📂 Project Structure

