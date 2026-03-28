const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

const createUser = async (table, req, res) => {
  const { login_id, name, description, password } = req.body;

  if (!login_id || !name || !password) {
    return res.status(400).json({ message: "login_id, name, and password are required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const data = { login_id, name, description: description || "", password_hash };
    let created = null;
    if (table === "members") {
      created = await prisma.member.create({ data });
    }
    if (table === "leaders") {
      created = await prisma.leader.create({ data });
    }
    return res.status(201).json({
      id: created.id,
      login_id: created.login_id,
      name: created.name,
      description: created.description,
      created_at: created.created_at
    });
  } catch (err) {
    return res.status(500).json({ message: "Unable to create user" });
  }
};

const listUsers = async (table, req, res) => {
  try {
    let users = [];
    if (table === "members") {
      users = await prisma.member.findMany({
        select: { id: true, login_id: true, name: true, description: true, created_at: true }
      });
    }
    if (table === "leaders") {
      users = await prisma.leader.findMany({
        select: { id: true, login_id: true, name: true, description: true, created_at: true }
      });
    }
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch users" });
  }
};

const deleteUser = async (table, req, res) => {
  const { id } = req.params;
  try {
    if (table === "members") {
      await prisma.member.delete({ where: { id: Number(id) } });
    }
    if (table === "leaders") {
      await prisma.leader.delete({ where: { id: Number(id) } });
    }
    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete user" });
  }
};

module.exports = {
  getMembers: (req, res) => listUsers("members", req, res),
  createMember: (req, res) => createUser("members", req, res),
  deleteMember: (req, res) => deleteUser("members", req, res),
  getLeaders: (req, res) => listUsers("leaders", req, res),
  createLeader: (req, res) => createUser("leaders", req, res),
  deleteLeader: (req, res) => deleteUser("leaders", req, res)
};
