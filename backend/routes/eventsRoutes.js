const express = require("express");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", getEvents);
router.post("/", authenticate, authorizeRoles("admin", "leader"), createEvent);
router.put("/:id", authenticate, authorizeRoles("admin", "leader"), updateEvent);
router.delete("/:id", authenticate, authorizeRoles("admin", "leader"), deleteEvent);

module.exports = router;
