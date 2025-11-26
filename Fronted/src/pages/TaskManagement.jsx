import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import api from "../utils/api";
import TaskBoard from "../components/TaskBoard";

export default function TaskManagement() {
  const { user } = useAuth();
  const { allTasks, fetchTasks } = useTasks();
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium"
  });
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    if (user.role === "manager") {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/tasks", form);
    setForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium"
    });
    fetchTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await api.put(`/tasks/${taskId}`, { status: newStatus });
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Task Management</h1>
      </div>

      {user.role === "manager" && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3"
        >
          <div className="flex gap-3">
            <input
              className="flex-1 text-sm px-3 py-2 border rounded dark:bg-gray-900"
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
            <select
              className="text-sm px-3 py-2 border rounded dark:bg-gray-900"
              value={form.priority}
              onChange={(e) =>
                setForm((f) => ({ ...f, priority: e.target.value }))
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <textarea
            className="w-full text-sm px-3 py-2 border rounded dark:bg-gray-900"
            rows={2}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />

          <select
            className="w-full text-sm px-3 py-2 border rounded dark:bg-gray-900"
            value={form.assignedTo}
            onChange={(e) =>
              setForm((f) => ({ ...f, assignedTo: e.target.value }))
            }
            required
          >
            <option value="">Assign to...</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email}) - {u.role}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white"
          >
            Create Task
          </button>
        </form>
      )}

      <TaskBoard
        tasks={allTasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        currentUser={user}
      />
    </div>
  );
}
