import sharp from "sharp"
import cloudinary from "../utils/cloudinary"
import { Post } from "../models/postmodel"
import { User } from "../models/usermodel"
import { ReturnDocument } from "mongodb"

export const addNewPost =  async (req, res) => {
    try {
        const {caption} = req.body
        const userid = req.id
        const image = req.file
        if(!image) res.status(400).json({success: false, message:'image is required'})
        const optimizedImageBuffer = await sharp(image.buffer).resize({width:800, height:800, fit:"inside"}).toFormat('jpeg',{quality:80}).toBuffer()
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
        const cloudinaryResponse = await cloudinary.uploader.upload(fileUri)
        const post = Post.create({
            caption,
            image: cloudinaryResponse.secure_url,
            author: userid
        })
        const user = await User.findById(userid)
        if (user) {
            user.posts.push(post._id);
            await user.save()
            
        }
        await post.populate({path:'author',select:'-password'})
        return res.status(200).json({
            message:'New post added',
            status: true
        })
    } catch (error) {
        console.log(error)
        
    }
}


export const getAllPost =  async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt:-1}).populate({path:'author', select:'username, profilePicture'}).populate({path:'comments', sort:{createdAt: -1}, populate: {path:'author', select:'username, profilePicture'} })
        return res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        console.log(error)
        
    }
}
