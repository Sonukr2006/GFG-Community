const prisma = require("../config/prisma");

const getResources = async (req, res) => {
  const { search, category } = req.query;
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
    if (category && category !== "all") {
      prismaWhere.category = category;
    }

    const total = await prisma.resource.count({ where: prismaWhere });
    const data = await prisma.resource.findMany({
      where: prismaWhere,
      orderBy: { created_at: "desc" },
      skip: offset,
      take: limit
    });

    return res.json({ data, meta: { total, page, limit } });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch resources" });
  }
};

const createResource = async (req, res) => {
  const { title, description, category, link } = req.body;

  try {
    const created = await prisma.resource.create({
      data: {
        title,
        description,
        category,
        link
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Unable to create resource" });
  }
};

const updateResource = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, link } = req.body;

  try {
    const updated = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        category,
        link
      }
    });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Unable to update resource" });
  }
};

const deleteResource = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.resource.delete({ where: { id: Number(id) } });
    return res.json({ message: "Resource deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete resource" });
  }
};

module.exports = {
  getResources,
  createResource,
  updateResource,
  deleteResource
};
