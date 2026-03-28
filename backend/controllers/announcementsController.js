const prisma = require("../config/prisma");

const getAnnouncements = async (req, res) => {
  try {
    const data = await prisma.announcement.findMany({ orderBy: { created_at: "desc" } });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch announcements" });
  }
};

const createAnnouncement = async (req, res) => {
  const { title, description } = req.body;

  try {
    const created = await prisma.announcement.create({
      data: { title, description }
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Unable to create announcement" });
  }
};

const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updated = await prisma.announcement.update({
      where: { id: Number(id) },
      data: { title, description }
    });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Unable to update announcement" });
  }
};

const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.announcement.delete({ where: { id: Number(id) } });
    return res.json({ message: "Announcement deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete announcement" });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
