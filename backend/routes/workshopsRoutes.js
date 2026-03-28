const express = require("express");
const {
  getWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop
} = require("../controllers/workshopsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", getWorkshops);
router.post("/", authenticate, authorizeRoles("admin", "leader"), createWorkshop);
router.put("/:id", authenticate, authorizeRoles("admin", "leader"), updateWorkshop);
router.delete("/:id", authenticate, authorizeRoles("admin", "leader"), deleteWorkshop);

module.exports = router;
