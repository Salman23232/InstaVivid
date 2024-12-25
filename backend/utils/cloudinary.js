import {v1 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config({})

cloudinary.config({
    cloudName: process.env.CLOUD_NAME,
    apiKey:process.env.API_KEY,
    apiSecret:process.env.API_SECRET
})

export default cloudinary