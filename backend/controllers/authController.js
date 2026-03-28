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
        select: {
          id: true,
          login_id: true,
          name: true,
          description: true,
          profile_photo_url: true,
          email: true,
          phone: true,
          branch: true,
          year: true,
          college: true,
          skills: true,
          bio: true,
          social_links: true,
          created_at: true
        }
      });
    }
    if (role === "leader") {
      user = await prisma.leader.findUnique({
        where: { id },
        select: {
          id: true,
          login_id: true,
          name: true,
          description: true,
          team_role: true,
          profile_photo_url: true,
          email: true,
          phone: true,
          branch: true,
          year: true,
          college: true,
          skills: true,
          bio: true,
          social_links: true,
          created_at: true
        }
      });
    }
    if (role === "member") {
      user = await prisma.member.findUnique({
        where: { id },
        select: {
          id: true,
          login_id: true,
          name: true,
          description: true,
          team_role: true,
          profile_photo_url: true,
          email: true,
          phone: true,
          branch: true,
          year: true,
          college: true,
          skills: true,
          bio: true,
          social_links: true,
          created_at: true
        }
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

const updateCurrentUser = async (req, res) => {
  const { id, role } = req.user || {};
  if (!id || !role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    name,
    description,
    team_role,
    profile_photo_url,
    email,
    phone,
    branch,
    year,
    college,
    skills,
    bio,
    social_links
  } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    let updated = null;
    if (role === "admin") {
      updated = await prisma.admin.update({
        where: { id },
        data: {
          name,
          description: description || "",
          profile_photo_url: profile_photo_url || "",
          email: email || "",
          phone: phone || "",
          branch: branch || "",
          year: year || "",
          college: college || "",
          skills: Array.isArray(skills) ? skills : [],
          bio: bio || "",
          social_links: social_links || ""
        },
        select: {
          id: true,
          login_id: true,
          name: true,
          description: true,
          profile_photo_url: true,
          email: true,
          phone: true,
          branch: true,
          year: true,
          college: true,
          skills: true,
          bio: true,
          social_links: true,
          created_at: true
        }
      });
    }
    if (role === "leader") {
      updated = await prisma.leader.update({
        where: { id },
        data: {
          name,
          description: description || "",
          team_role: team_role || "General",
          profile_photo_url: profile_photo_url || "",
          email: email || "",
          phone: phone || "",
          branch: branch || "",
          year: year || "",
          college: college || "",
          skills: Array.isArray(skills) ? skills : [],
          bio: bio || "",
          social_links: social_links || ""
        },
        select: {
          id: true,
          login_id: true,
          name: true,
          description: true,
          team_role: true,
          profile_photo_url: true,
          email: true,
          phone: true,
          branch: true,
          year: true,
          college: true,
          skills: true,
          bio: true,
          social_links: true,
          created_at: true
        }
      });
    }
    if (role === "member") {
      updated = await prisma.member.update({
        where: { id },
        data: {
          name,
          description: description || "",
          team_role: team_role || "General",
          profile_photo_url: profile_photo_url || "",
          email: email || "",
          phone: phone || "",
          branch: branch || "",
          year: year || "",
          college: college || "",
          skills: Array.isArray(skills) ? skills : [],
          bio: bio || "",
          social_links: social_links || ""
        },
        select: {
          id: true,
          login_id: true,
          name: true,
          description: true,
          team_role: true,
          profile_photo_url: true,
          email: true,
          phone: true,
          branch: true,
          year: true,
          college: true,
          skills: true,
          bio: true,
          social_links: true,
          created_at: true
        }
      });
    }

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ ...updated, role });
  } catch (err) {
    console.error("Update profile failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to update profile" });
  }
};

const updatePassword = async (req, res) => {
  const { id, role } = req.user || {};
  if (!id || !role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { current_password, new_password } = req.body || {};
  if (!current_password || !new_password) {
    return res.status(400).json({ message: "Current and new password are required" });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  try {
    let user = null;
    if (role === "admin") user = await prisma.admin.findUnique({ where: { id } });
    if (role === "leader") user = await prisma.leader.findUnique({ where: { id } });
    if (role === "member") user = await prisma.member.findUnique({ where: { id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const matches = await bcrypt.compare(current_password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    if (role === "admin") await prisma.admin.update({ where: { id }, data: { password_hash } });
    if (role === "leader") await prisma.leader.update({ where: { id }, data: { password_hash } });
    if (role === "member") await prisma.member.update({ where: { id }, data: { password_hash } });

    return res.json({ message: "Password updated" });
  } catch (err) {
    console.error("Update password failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to update password" });
  }
};

module.exports = {
  adminLogin: login("admin"),
  leaderLogin: login("leader"),
  memberLogin: login("member"),
  getCurrentUser,
  updateCurrentUser,
  updatePassword
};
