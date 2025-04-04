// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// require("dotenv").config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Multer Storage with Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "blog_images",
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog_images", // Cloudinary folder name
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

// Multer middleware
const upload = multer({ storage });

module.exports = upload;
