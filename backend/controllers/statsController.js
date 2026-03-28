const prisma = require("../config/prisma");

const getStats = async (req, res) => {
  try {
    const [events, workshops, members, announcements] = await Promise.all([
      prisma.event.count(),
      prisma.workshop.count(),
      prisma.member.count(),
      prisma.announcement.count()
    ]);

    return res.json({ events, workshops, members, announcements });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch stats" });
  }
};

module.exports = { getStats };
