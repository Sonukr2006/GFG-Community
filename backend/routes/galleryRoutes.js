const express = require("express");
const multer = require("multer");
const { getGallery, createGalleryItem, deleteGalleryItem } = require("../controllers/galleryController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/", getGallery);
router.post("/", authenticate, authorizeRoles("admin", "leader"), upload.single("image"), createGalleryItem);
router.delete("/:id", authenticate, authorizeRoles("admin", "leader"), deleteGalleryItem);

module.exports = router;
