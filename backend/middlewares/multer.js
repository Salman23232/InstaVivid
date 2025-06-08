import multer from "multer"
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
 
export const storage = new CloudinaryStorage({
    cloudinary,
    params:(req, file) => {
        const isVideo = file.fieldname === "video";
    return{
        folder: isVideo? 'videos' : 'images',
        resource_type: isVideo? 'video' : 'image',
        allowed_format: isVideo? ["mp4","mov"] : ["png","jpg","jpeg"],
    }

    }
})


const upload = multer({storage})
export default upload




