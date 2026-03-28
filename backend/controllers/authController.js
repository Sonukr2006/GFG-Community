const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const login = (role) => async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: "ID and password are required" });
  }

  try {
    let user = null;
    if (role === "admin") {
      user = await prisma.admin.findUnique({ where: { login_id: id } });
    }
    if (role === "leader") {
      user = await prisma.leader.findUnique({ where: { login_id: id } });
    }
    if (role === "member") {
      user = await prisma.member.findUnique({ where: { login_id: id } });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, role });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  const { id, role } = req.user || {};
  if (!id || !role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let user = null;
    if (role === "admin") {
      user = await prisma.admin.findUnique({
        where: { id },
        select: { id: true, login_id: true, name: true, description: true, created_at: true }
      });
    }
    if (role === "leader") {
      user = await prisma.leader.findUnique({
        where: { id },
        select: { id: true, login_id: true, name: true, description: true, created_at: true }
      });
    }
    if (role === "member") {
      user = await prisma.member.findUnique({
        where: { id },
        select: { id: true, login_id: true, name: true, description: true, created_at: true }
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ ...user, role });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  adminLogin: login("admin"),
  leaderLogin: login("leader"),
  memberLogin: login("member"),
  getCurrentUser
};
