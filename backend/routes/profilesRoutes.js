const express = require("express");
const { getProfiles } = require("../controllers/profilesController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/profiles", authenticate, authorizeRoles("admin"), getProfiles);

module.exports = router;
