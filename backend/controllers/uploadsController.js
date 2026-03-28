const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "gfg-community/events",
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

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: "Cloudinary credentials are missing" });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    return res.status(201).json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload failed:", err?.message || err);
    if (err?.http_code || err?.statusCode) {
      console.error("Cloudinary status:", err.http_code || err.statusCode);
    }
    return res.status(500).json({ message: "Image upload failed", error: err?.message || "unknown" });
  }
};

module.exports = { uploadImage };
