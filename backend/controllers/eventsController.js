const prisma = require("../config/prisma");

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const getEvents = async (req, res) => {
  const { search, status } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prismaWhere = {};
    if (search) {
      prismaWhere.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }
    if (status === "upcoming") {
      prismaWhere.start_date = { gte: today };
    }
    if (status === "past") {
      prismaWhere.start_date = { lt: today };
    }

    const total = await prisma.event.count({ where: prismaWhere });
    const data = await prisma.event.findMany({
      where: prismaWhere,
      orderBy: { start_date: "desc" },
      skip: offset,
      take: limit
    });

    return res.json({ data, meta: { total, page, limit } });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch events" });
  }
};

const createEvent = async (req, res) => {
  const { title, description, start_date, end_date, location, registration_link, image_url } = req.body;
  const normalizedEndDate = end_date || null;
  const parsedStartDate = toDate(start_date);

  try {
    if (!title || !description || !parsedStartDate) {
      return res.status(400).json({
        message: "Title, description, and a valid start date are required"
      });
    }

    const created = await prisma.event.create({
      data: {
        title,
        description,
        start_date: parsedStartDate,
        end_date: toDate(normalizedEndDate),
        location: location || null,
        registration_link: registration_link || null,
        image_url: image_url || null
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error("Create event failed:", err?.message || err);
    return res.status(500).json({
      message: "Unable to create event",
      error: err?.message || "unknown"
    });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, location, registration_link, image_url } = req.body;
  const normalizedEndDate = end_date || null;
  const parsedStartDate = start_date ? toDate(start_date) : null;

  try {
    if (start_date && !parsedStartDate) {
      return res.status(400).json({ message: "Invalid start date" });
    }

    const updated = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        start_date: parsedStartDate || undefined,
        end_date: end_date ? toDate(normalizedEndDate) : undefined,
        location: location ?? undefined,
        registration_link: registration_link ?? undefined,
        image_url: image_url ?? undefined
      }
    });

    return res.json(updated);
  } catch (err) {
    console.error("Update event failed:", err?.message || err);
    return res.status(500).json({
      message: "Unable to update event",
      error: err?.message || "unknown"
    });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({ where: { id: Number(id) } });
    return res.json({ message: "Event deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete event" });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
