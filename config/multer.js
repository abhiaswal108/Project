const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Import from your config file

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "FullStack-Blog",
    allowedFormats: ["jpg", "png"]
  }
});

const upload = multer({ storage });
module.exports = upload;