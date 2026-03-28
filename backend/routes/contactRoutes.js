const express = require("express");
const {
  createContactMessage,
  getContactMessages,
  deleteContactMessage
} = require("../controllers/contactController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/contact", createContactMessage);
router.get("/contact-messages", authenticate, authorizeRoles("admin", "leader"), getContactMessages);
router.delete(
  "/contact-messages/:id",
  authenticate,
  authorizeRoles("admin", "leader"),
  deleteContactMessage
);

module.exports = router;
