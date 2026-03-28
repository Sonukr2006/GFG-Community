const express = require("express");
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require("../controllers/announcementsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAnnouncements);
router.post("/", authenticate, authorizeRoles("admin", "leader"), createAnnouncement);
router.put("/:id", authenticate, authorizeRoles("admin", "leader"), updateAnnouncement);
router.delete("/:id", authenticate, authorizeRoles("admin", "leader"), deleteAnnouncement);

module.exports = router;
