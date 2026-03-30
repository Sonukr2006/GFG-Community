const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

const getEntityLabel = (table) => (table === "leaders" ? "Leader" : "Member");

const getCreateErrorMessage = (table, err, loginId) => {
  const entityLabel = getEntityLabel(table);

  if (err?.code === "P2002") {
    return `${entityLabel} login ID "${loginId}" already exists. Please use a different login ID.`;
  }

  return `Unable to create ${entityLabel.toLowerCase()}. Please try again.`;
};

const getDeleteErrorMessage = (table, err, relatedTaskCount) => {
  const entityLabel = getEntityLabel(table);

  if (err?.code === "P2025") {
    return `${entityLabel} not found.`;
  }

  if (table === "members" && err?.code === "P2003") {
    const taskText =
      relatedTaskCount > 0
        ? ` ${relatedTaskCount} task${relatedTaskCount === 1 ? " is" : "s are"} still assigned to this member.`
        : "";
    return `Cannot delete this member because it is linked to existing records.${taskText} Remove or reassign those tasks first.`;
  }

  return `Unable to delete ${entityLabel.toLowerCase()}. Please try again.`;
};

const createUser = async (table, req, res) => {
  const { login_id, name, description, password, team_role } = req.body;

  if (!login_id || !name || !password) {
    return res.status(400).json({ message: "login_id, name, and password are required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const data = {
      login_id,
      name,
      description: description || "",
      password_hash
    };
    if (table === "members") {
      data.team_role = team_role || "General";
    }
    if (table === "leaders") {
      data.team_role = team_role || "General";
    }
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
      team_role: created.team_role,
      created_at: created.created_at
    });
  } catch (err) {
    console.error(`Create ${table} failed:`, err);
    const status = err?.code === "P2002" ? 409 : 500;
    return res.status(status).json({ message: getCreateErrorMessage(table, err, login_id) });
  }
};

const listUsers = async (table, req, res) => {
  try {
    let users = [];
    if (table === "members") {
      users = await prisma.member.findMany({
        select: { id: true, login_id: true, name: true, description: true, team_role: true, created_at: true }
      });
    }
    if (table === "leaders") {
      users = await prisma.leader.findMany({
        select: { id: true, login_id: true, name: true, description: true, team_role: true, created_at: true }
      });
    }
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch users" });
  }
};

const deleteUser = async (table, req, res) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    if (table === "members") {
      await prisma.member.delete({ where: { id: numericId } });
    }
    if (table === "leaders") {
      await prisma.leader.delete({ where: { id: numericId } });
    }
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error(`Delete ${table} failed:`, err);
    const relatedTaskCount =
      table === "members"
        ? await prisma.task.count({ where: { assigned_member_id: numericId } }).catch(() => 0)
        : 0;
    const status = err?.code === "P2025" ? 404 : err?.code === "P2003" ? 409 : 500;
    return res.status(status).json({ message: getDeleteErrorMessage(table, err, relatedTaskCount) });
  }
};

module.exports = {
  getMemberById: async (req, res) => {
    const { id } = req.params;
    try {
      const member = await prisma.member.findUnique({
        where: { id: Number(id) },
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
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      return res.json(member);
    } catch (err) {
      return res.status(500).json({ message: "Unable to fetch member" });
    }
  },
  getLeaderById: async (req, res) => {
    const { id } = req.params;
    try {
      const leader = await prisma.leader.findUnique({
        where: { id: Number(id) },
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
      if (!leader) {
        return res.status(404).json({ message: "Leader not found" });
      }
      return res.json(leader);
    } catch (err) {
      return res.status(500).json({ message: "Unable to fetch leader" });
    }
  },
  getMembers: (req, res) => listUsers("members", req, res),
  createMember: (req, res) => createUser("members", req, res),
  deleteMember: (req, res) => deleteUser("members", req, res),
  getLeaders: (req, res) => listUsers("leaders", req, res),
  createLeader: (req, res) => createUser("leaders", req, res),
  deleteLeader: (req, res) => deleteUser("leaders", req, res)
};
