const express = require("express");
const {
  getResources,
  createResource,
  updateResource,
  deleteResource
} = require("../controllers/resourcesController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", getResources);
router.post("/", authenticate, authorizeRoles("admin", "leader"), createResource);
router.put("/:id", authenticate, authorizeRoles("admin", "leader"), updateResource);
router.delete("/:id", authenticate, authorizeRoles("admin", "leader"), deleteResource);

module.exports = router;
