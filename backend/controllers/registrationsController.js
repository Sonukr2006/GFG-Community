const prisma = require("../config/prisma");

const registerEvent = async (req, res) => {
  const { event_id, title, description } = req.body;
  const memberId = req.user.id;

  try {
    const created = await prisma.eventRegistration.create({
      data: {
        event_id: Number(event_id),
        member_id: Number(memberId),
        title: title || "Event Registration",
        description: description || ""
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Unable to register for event" });
  }
};

const registerWorkshop = async (req, res) => {
  const { workshop_id, title, description } = req.body;
  const memberId = req.user.id;

  try {
    const created = await prisma.workshopRegistration.create({
      data: {
        workshop_id: Number(workshop_id),
        member_id: Number(memberId),
        title: title || "Workshop Registration",
        description: description || ""
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Unable to register for workshop" });
  }
};

module.exports = { registerEvent, registerWorkshop };
