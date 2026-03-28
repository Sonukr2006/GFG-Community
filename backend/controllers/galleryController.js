const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "gfg-community/gallery",
        public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined,
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    stream.end(fileBuffer);
  });

const getGallery = async (req, res) => {
  try {
    const data = await prisma.gallery.findMany({ orderBy: { created_at: "desc" } });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch gallery" });
  }
};

const createGalleryItem = async (req, res) => {
  const { title, description, image_url } = req.body;
  let finalUrl = image_url || null;

  if (!finalUrl && req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      finalUrl = result.secure_url;
    } catch (err) {
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

  if (!finalUrl) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const created = await prisma.gallery.create({
      data: {
        title: title || "Gallery Image",
        description: description || "",
        image_url: finalUrl
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Unable to create gallery item" });
  }
};

const deleteGalleryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.gallery.delete({ where: { id: Number(id) } });
    return res.json({ message: "Gallery item deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to delete gallery item" });
  }
};

module.exports = { getGallery, createGalleryItem, deleteGalleryItem };
