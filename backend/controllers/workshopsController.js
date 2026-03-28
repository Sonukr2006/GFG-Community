const prisma = require("../config/prisma");

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const getWorkshops = async (req, res) => {
  const { search, level } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  try {
    const prismaWhere = {};
    if (search) {
      prismaWhere.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }
    if (level && level !== "all") {
      prismaWhere.level = level;
    }

    const total = await prisma.workshop.count({ where: prismaWhere });
    const data = await prisma.workshop.findMany({
      where: prismaWhere,
      orderBy: { date: "desc" },
      skip: offset,
      take: limit
    });

    return res.json({ data, meta: { total, page, limit } });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch workshops" });
  }
};

const createWorkshop = async (req, res) => {
  const { title, description, date, level, location, image_url } = req.body;

  try {
    const created = await prisma.workshop.create({
      data: {
        title,
        description,
        date: toDate(date),
        level: level || null,
        location: location || null,
        image_url: image_url || null
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Unable to create workshop" });
  }
};

const updateWorkshop = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, level, location, image_url } = req.body;

  try {
    const updated = await prisma.workshop.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        date: toDate(date),
        level: level || null,
        location: location || null,
        image_url: image_url || null
      }
    });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Unable to update workshop" });
  }
};

const deleteWorkshop = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.workshop.delete({ where: { id: Number(id) } });
    return res.json({ message: "Workshop deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete workshop" });
  }
};

module.exports = { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop };
