import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasksAssigned, setTasksAssigned] = useState([]);
  const [tasksCreated, setTasksCreated] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const fetchTasks = async () => {
    if (!user) return;
    const [assignedRes, createdRes, allRes] = await Promise.all([
      api.get("/tasks?assignedToMe=true"),
      user.role === "manager"
        ? api.get("/tasks?createdByMe=true")
        : Promise.resolve({ data: { data: [] } }),
      api.get("/tasks")
    ]);

    setTasksAssigned(assignedRes.data.data);
    setTasksCreated(createdRes.data.data);
    setAllTasks(allRes.data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = io("http://localhost:5000");
    socket.emit("join", user._id);
    socket.on("taskUpdated", () => {
      fetchTasks();
    });
    socket.on("taskDeleted", () => {
      fetchTasks();
    });
    return () => socket.disconnect();
  }, [user]);

  return (
    <TaskContext.Provider
      value={{ tasksAssigned, tasksCreated, allTasks, fetchTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
