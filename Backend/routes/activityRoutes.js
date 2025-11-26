// routes/activityRoutes.js
import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

// GET /api/activity (manager only)
router.get("/", protect, requireRole("manager"), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name email role")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    console.error("Get activity logs error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
