const express = require("express");
const {
  getMemberById,
  getMembers,
  createMember,
  deleteMember,
  getLeaderById,
  getLeaders,
  createLeader,
  deleteLeader
} = require("../controllers/usersController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/members", authenticate, authorizeRoles("admin", "leader"), getMembers);
router.get("/members/:id", authenticate, authorizeRoles("admin", "leader"), getMemberById);
router.post("/members", authenticate, authorizeRoles("admin", "leader"), createMember);
router.delete("/members/:id", authenticate, authorizeRoles("admin"), deleteMember);

router.get("/leaders", authenticate, authorizeRoles("admin"), getLeaders);
router.get("/leaders/:id", authenticate, authorizeRoles("admin"), getLeaderById);
router.post("/leaders", authenticate, authorizeRoles("admin"), createLeader);
router.delete("/leaders/:id", authenticate, authorizeRoles("admin"), deleteLeader);

module.exports = router;
