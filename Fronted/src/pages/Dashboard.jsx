import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { tasksAssigned, tasksCreated } = useTasks();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">
          Tasks assigned to you
        </h2>
        <div className="grid gap-3">
          {tasksAssigned.map((t) => (
            <div
              key={t._id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm flex justify-between"
            >
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-gray-500">
                  Status: {t.status} • Priority: {t.priority}
                </p>
              </div>
            </div>
          ))}
          {tasksAssigned.length === 0 && (
            <p className="text-xs text-gray-500">
              No tasks assigned yet.
            </p>
          )}
        </div>
      </section>

      {user.role === "manager" && (
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Tasks you created
          </h2>
          <div className="grid gap-3">
            {tasksCreated.map((t) => (
              <div
                key={t._id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm flex justify-between"
              >
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-gray-500">
                    Assigned to: {t.assignedTo?.name || "—"} • Status: {t.status}
                  </p>
                </div>
              </div>
            ))}
            {tasksCreated.length === 0 && (
              <p className="text-xs text-gray-500">
                You haven’t created any tasks yet.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
