const prisma = require("../config/prisma");

const getProfiles = async (req, res) => {
  const role = req.query.role || "members";
  try {
    if (role === "admins") {
      const data = await prisma.admin.findMany({
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
      return res.json(data);
    }
    if (role === "leaders") {
      const data = await prisma.leader.findMany({
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
      return res.json(data);
    }
    const data = await prisma.member.findMany({
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
    return res.json(data);
  } catch (err) {
    console.error("Fetch profiles failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to load profiles" });
  }
};

module.exports = { getProfiles };
