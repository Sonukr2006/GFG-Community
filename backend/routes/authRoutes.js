const express = require("express");
const {
  adminLogin,
  leaderLogin,
  memberLogin,
  getCurrentUser,
  updateCurrentUser,
  updatePassword
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/leader/login", leaderLogin);
router.post("/member/login", memberLogin);
router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateCurrentUser);
router.put("/me/password", authenticate, updatePassword);

module.exports = router;
