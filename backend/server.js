require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const prisma = require("./config/prisma");

const authRoutes = require("./routes/authRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const workshopsRoutes = require("./routes/workshopsRoutes");
const teamMembersRoutes = require("./routes/teamMembersRoutes");
const announcementsRoutes = require("./routes/announcementsRoutes");
const resourcesRoutes = require("./routes/resourcesRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const registrationsRoutes = require("./routes/registrationsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const statsRoutes = require("./routes/statsRoutes");
const uploadsRoutes = require("./routes/uploadsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const profilesRoutes = require("./routes/profilesRoutes");

const app = express();

const requiredEnvs = ["JWT_SECRET", "DATABASE_URL"];
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

app.set("trust proxy", 1);

const defaultCorsOrigins = ["http://localhost:3000", "https://gfg-community.vercel.app"];
const configuredCorsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOrigins = [...new Set([...defaultCorsOrigins, ...configuredCorsOrigins])];

const vercelPreviewPattern = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests and non-browser tools without an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (corsOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", limiter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "GFG Community API running" });
});

app.use("/api", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/workshops", workshopsRoutes);
app.use("/api/team-members", teamMembersRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api", registrationsRoutes);
app.use("/api", usersRoutes);
app.use("/api", statsRoutes);
app.use("/api", uploadsRoutes);
app.use("/api", contactRoutes);
app.use("/api", tasksRoutes);
app.use("/api", profilesRoutes);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
};

startServer();
