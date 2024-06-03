import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
});

// Create a variable for storing Image
const storage = multer.diskStorage({});

// Create a variable for add limits of the file
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

const uploadImage = (req, res, next) => {
  console.log("salman");
  upload.single("image")(req, res, async (error) => {
    try {
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        req.cloudinaryImageUrl = uploadResult.secure_url;
      }
      next();
    } catch (error) {
      return next(error);
    }
  });
};
export default uploadImage