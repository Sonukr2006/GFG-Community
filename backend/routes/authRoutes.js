const express = require("express");
const {
  adminLogin,
  leaderLogin,
  memberLogin,
  getCurrentUser
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/leader/login", leaderLogin);
router.post("/member/login", memberLogin);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
