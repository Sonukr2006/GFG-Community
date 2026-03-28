require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

const seedUser = async (table, login_id, name, password) => {
  const password_hash = await bcrypt.hash(password, 10);
  const data = { login_id, name, description: "Seeded account", password_hash };
  if (table === "admins") {
    await prisma.admin.upsert({
      where: { login_id },
      update: {},
      create: data
    });
  }
  if (table === "leaders") {
    await prisma.leader.upsert({
      where: { login_id },
      update: {},
      create: data
    });
  }
  if (table === "members") {
    await prisma.member.upsert({
      where: { login_id },
      update: {},
      create: data
    });
  }
};

const run = async () => {
  try {
    await seedUser("admins", "gfg_admin", "GFG Admin", "secure_password");
    await seedUser("leaders", "leader01", "Team Leader", "leader_password");
    await seedUser("members", "member01", "GFG Member", "member_password");
    console.log("Seed complete");
  } catch (err) {
    console.error("Seed failed", err);
  } finally {
    await prisma.$disconnect();
  }
};

run();
