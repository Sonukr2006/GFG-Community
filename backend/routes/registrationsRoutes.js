const express = require("express");
const { registerEvent, registerWorkshop } = require("../controllers/registrationsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/events/register", authenticate, authorizeRoles("member"), registerEvent);
router.post("/workshops/register", authenticate, authorizeRoles("member"), registerWorkshop);

module.exports = router;
