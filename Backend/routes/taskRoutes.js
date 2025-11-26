// routes/taskRoutes.js
import express from "express";
import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

// helper: log activity
const logActivity = async ({ taskId, userId, action, details }) => {
  await ActivityLog.create({
    task: taskId,
    user: userId,
    action,
    details
  });
};

// GET /api/tasks?assignedToMe=true&createdByMe=true&page=1&limit=10
router.get("/", protect, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.assignedToMe === "true") {
      filter.assignedTo = req.user._id;
    }

    if (req.query.createdByMe === "true") {
      filter.createdBy = req.user._id;
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter)
    ]);

    res.json({
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isManager = req.user.role === "manager";
    const isAssignee =
      task.assignedTo._id.toString() === req.user._id.toString();

    if (!isManager && !isAssignee) {
      return res.status(403).json({ message: "Not allowed to view this task" });
    }

    res.json(task);
  } catch (err) {
    console.error("Get task by id error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks (manager only)
router.post("/", protect, requireRole("manager"), async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      createdBy: req.user._id
    });

    await logActivity({
      taskId: task._id,
      userId: req.user._id,
      action: "created",
      details: `Task "${task.title}" created`
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("taskUpdated", task);
    }

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id (manager can edit; user can change status)
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isManager = req.user.role === "manager";
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();

    if (!isManager && !isAssignee) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this task" });
    }

    const oldStatus = task.status;

    if (isManager) {
      if (req.body.title !== undefined) task.title = req.body.title;
      if (req.body.description !== undefined)
        task.description = req.body.description;
      if (req.body.status !== undefined) task.status = req.body.status;
      if (req.body.priority !== undefined) task.priority = req.body.priority;
      if (req.body.assignedTo !== undefined)
        task.assignedTo = req.body.assignedTo;
      if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
    } else {
      // user (non-manager) can ONLY change status
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return res
          .status(403)
          .json({ message: "Users can only update task status" });
      }
    }

    const updated = await task.save();

    await logActivity({
      taskId: updated._id,
      userId: req.user._id,
      action: oldStatus !== updated.status ? "status_changed" : "updated",
      details:
        oldStatus !== updated.status
          ? `Status changed from ${oldStatus} to ${updated.status}`
          : `Task updated`
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("taskUpdated", updated);
    }

    res.json(updated);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id (manager only)
router.delete("/:id", protect, requireRole("manager"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();

    await logActivity({
      taskId: task._id,
      userId: req.user._id,
      action: "deleted",
      details: `Task "${task.title}" deleted`
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("taskDeleted", { id: task._id });
    }

    res.json({ message: "Task removed" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
