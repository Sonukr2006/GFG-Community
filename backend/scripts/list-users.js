require("dotenv").config();
const prisma = require("../config/prisma");

const run = async () => {
  try {
    const admins = await prisma.admin.findMany({ select: { login_id: true, name: true } });
    const leaders = await prisma.leader.findMany({ select: { login_id: true, name: true } });
    const members = await prisma.member.findMany({ select: { login_id: true, name: true } });

    console.log("Admins:");
    admins.forEach((u) => console.log(`- ${u.login_id} (${u.name})`));

    console.log("\nLeaders:");
    leaders.forEach((u) => console.log(`- ${u.login_id} (${u.name})`));

    console.log("\nMembers:");
    members.forEach((u) => console.log(`- ${u.login_id} (${u.name})`));
  } catch (err) {
    console.error("Failed to list users", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

run();
