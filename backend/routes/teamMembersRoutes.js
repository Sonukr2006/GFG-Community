const express = require("express");
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require("../controllers/teamMembersController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);
router.post("/", authenticate, authorizeRoles("admin", "leader"), createTeamMember);
router.put("/:id", authenticate, authorizeRoles("admin", "leader"), updateTeamMember);
router.delete("/:id", authenticate, authorizeRoles("admin", "leader"), deleteTeamMember);

module.exports = router;
