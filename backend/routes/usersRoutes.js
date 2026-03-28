const express = require("express");
const {
  getMembers,
  createMember,
  deleteMember,
  getLeaders,
  createLeader,
  deleteLeader
} = require("../controllers/usersController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/members", authenticate, authorizeRoles("admin"), getMembers);
router.post("/members", authenticate, authorizeRoles("admin"), createMember);
router.delete("/members/:id", authenticate, authorizeRoles("admin"), deleteMember);

router.get("/leaders", authenticate, authorizeRoles("admin"), getLeaders);
router.post("/leaders", authenticate, authorizeRoles("admin"), createLeader);
router.delete("/leaders/:id", authenticate, authorizeRoles("admin"), deleteLeader);

module.exports = router;
