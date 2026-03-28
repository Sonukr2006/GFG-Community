const express = require("express");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/tasksController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/tasks", authenticate, getTasks);
router.post("/tasks", authenticate, authorizeRoles("admin", "leader"), createTask);
router.put("/tasks/:id", authenticate, authorizeRoles("admin", "leader"), updateTask);
router.delete("/tasks/:id", authenticate, authorizeRoles("admin", "leader"), deleteTask);

module.exports = router;
