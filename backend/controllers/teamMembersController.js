const prisma = require("../config/prisma");

const getTeamMembers = async (req, res) => {
  try {
    const data = await prisma.teamMember.findMany({ orderBy: { created_at: "desc" } });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch team members" });
  }
};

const getTeamMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: Number(id) }
    });
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    return res.json(member);
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch team member" });
  }
};

const createTeamMember = async (req, res) => {
  const { name, description, role, skills, photo_url } = req.body;

  try {
    const created = await prisma.teamMember.create({
      data: {
        name,
        description,
        role,
        skills: skills || [],
        photo_url: photo_url || null
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Unable to create team member" });
  }
};

const updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { name, description, role, skills, photo_url } = req.body;

  try {
    const updated = await prisma.teamMember.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        role,
        skills: skills || [],
        photo_url: photo_url || null
      }
    });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Unable to update team member" });
  }
};

const deleteTeamMember = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.teamMember.delete({ where: { id: Number(id) } });
    return res.json({ message: "Team member deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete team member" });
  }
};

module.exports = { getTeamMembers, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember };
