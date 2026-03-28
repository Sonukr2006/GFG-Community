const prisma = require("../config/prisma");

const createContactMessage = async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }

  const contactModel = prisma.contactMessage;
  if (!contactModel) {
    return res.status(500).json({
      message: "Contact model not available. Run `npx prisma generate` and restart the server."
    });
  }

  try {
    const created = await contactModel.create({
      data: {
        name,
        email,
        message
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error("Create contact message failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to submit message" });
  }
};

const getContactMessages = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  const contactModel = prisma.contactMessage;
  if (!contactModel) {
    return res.status(500).json({
      message: "Contact model not available. Run `npx prisma generate` and restart the server."
    });
  }

  try {
    const total = await contactModel.count();
    const data = await contactModel.findMany({
      orderBy: { created_at: "desc" },
      skip: offset,
      take: limit
    });
    return res.json({ data, meta: { total, page, limit } });
  } catch (err) {
    console.error("Fetch contact messages failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to load messages" });
  }
};

const deleteContactMessage = async (req, res) => {
  const { id } = req.params;
  const contactModel = prisma.contactMessage;
  if (!contactModel) {
    return res.status(500).json({
      message: "Contact model not available. Run `npx prisma generate` and restart the server."
    });
  }

  try {
    await contactModel.delete({ where: { id: Number(id) } });
    return res.json({ message: "Message deleted" });
  } catch (err) {
    console.error("Delete contact message failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to delete message" });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  deleteContactMessage
};
