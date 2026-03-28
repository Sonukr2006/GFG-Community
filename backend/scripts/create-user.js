require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

const [role, login_id, password, nameArg, descriptionArg] = process.argv.slice(2);

const allowedRoles = ["admin", "leader", "member"];

const usage = () => {
  console.log("Usage: node scripts/create-user.js <role> <login_id> <password> [name] [description]");
  console.log("Example: node scripts/create-user.js admin gfg_admin secure_password \"GFG Admin\"");
};

const run = async () => {
  if (!role || !login_id || !password || !allowedRoles.includes(role)) {
    usage();
    process.exit(1);
  }

  const name = nameArg || login_id;
  const description = descriptionArg || "";
  const password_hash = await bcrypt.hash(password, 10);

  try {
    if (role === "admin") {
      await prisma.admin.upsert({
        where: { login_id },
        update: { name, description, password_hash },
        create: { login_id, name, description, password_hash }
      });
    }
    if (role === "leader") {
      await prisma.leader.upsert({
        where: { login_id },
        update: { name, description, password_hash },
        create: { login_id, name, description, password_hash }
      });
    }
    if (role === "member") {
      await prisma.member.upsert({
        where: { login_id },
        update: { name, description, password_hash },
        create: { login_id, name, description, password_hash }
      });
    }

    console.log(`${role} user ready: ${login_id}`);
  } catch (err) {
    console.error("Failed to create user", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

run();
