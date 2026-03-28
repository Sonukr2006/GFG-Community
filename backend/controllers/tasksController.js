const prisma = require("../config/prisma");

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const getTasks = async (req, res) => {
  const { search, status, member_id } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  const role = req.user?.role;
  const userId = req.user?.id;

  try {
    const prismaWhere = {};
    if (search) {
      prismaWhere.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }
    if (status && status !== "all") {
      prismaWhere.status = status;
    }

    if (role === "member") {
      prismaWhere.assigned_member_id = userId;
    } else if (member_id) {
      prismaWhere.assigned_member_id = Number(member_id);
    }

    const total = await prisma.task.count({ where: prismaWhere });
    const data = await prisma.task.findMany({
      where: prismaWhere,
      orderBy: { created_at: "desc" },
      include: {
        assigned_member: { select: { id: true, name: true, login_id: true } }
      },
      skip: offset,
      take: limit
    });

    return res.json({ data, meta: { total, page, limit } });
  } catch (err) {
    console.error("Fetch tasks failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to load tasks" });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, due_date, assigned_member_id } = req.body || {};
  const { role, id } = req.user || {};

  if (!title || !description || !assigned_member_id) {
    return res.status(400).json({ message: "Title, description, and member are required" });
  }

  const parsedDue = due_date ? toDate(due_date) : null;
  if (due_date && !parsedDue) {
    return res.status(400).json({ message: "Invalid due date" });
  }

  try {
    if (assigned_member_id === "all") {
      const members = await prisma.member.findMany({ select: { id: true } });
      if (members.length === 0) {
        return res.status(400).json({ message: "No members available to assign" });
      }
      const data = members.map((member) => ({
        title,
        description,
        status: status || "pending",
        due_date: parsedDue,
        assigned_member_id: member.id,
        created_by_role: role,
        created_by_id: id
      }));
      const result = await prisma.task.createMany({ data });
      return res.status(201).json({ message: "Tasks assigned to all members", count: result.count });
    }

    const created = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "pending",
        due_date: parsedDue,
        assigned_member_id: Number(assigned_member_id),
        created_by_role: role,
        created_by_id: id
      },
      include: {
        assigned_member: { select: { id: true, name: true, login_id: true } }
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error("Create task failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to create task" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date, assigned_member_id } = req.body || {};

  const parsedDue = due_date ? toDate(due_date) : null;
  if (due_date && !parsedDue) {
    return res.status(400).json({ message: "Invalid due date" });
  }

  try {
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
        due_date: due_date ? parsedDue : undefined,
        assigned_member_id: assigned_member_id ? Number(assigned_member_id) : undefined
      },
      include: {
        assigned_member: { select: { id: true, name: true, login_id: true } }
      }
    });
    return res.json(updated);
  } catch (err) {
    console.error("Update task failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to update task" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id: Number(id) } });
    return res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task failed:", err?.message || err);
    return res.status(500).json({ message: "Unable to delete task" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
