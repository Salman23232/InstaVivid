import { User } from "../models/usermodel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body

        if (!username || !email || !password) {
            res.status(401).json({
                success: false,
                message: 'Something is missing, please check'
            })
        }
        const user = await User.findOne({email})
        if (user) {
            res.status(401).json({
                success: false,
                message: 'User already resisterd'
            }) 
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            password: hashedPassword,
            email

        })
        return res.status(201).json({
            success: true,
            message: 'Account created successfully'
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            res.status(401).json({
                success: false,
                message: 'Something is missing, please check'
            })
        }
        const user = await User.findOne({email})
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            }) 
        }
        const isMatchedPassword = await bcrypt.compare(password, user.password);
        await User.create({
            username,
            password: hashedPassword,
            email

        })
        if (!isMatchedPassword) {
            res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            }) 
        
        }
        user = {
            _id: user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio: user.bio,
            posts:user.posts,
            followers:user.follower,
            following:user.following,

        }
        const token = jwt.sign({userid:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
        return res.cookie('token',token,{httpOnly:true, sameSite:'strict', maxAge:1*24*60*60*1000}).json({
             message:`welcome back ${user.username}`,
             success: true

        })
    } catch (error) {
        console.log(error);
        
    }
}

export const logout = async (_, res) => {
    try {
        return res.cookie('token','', {maxAge:0}).json({
            message:'logged out successfully.',
            success: true
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getProfile = async (req, res) => {
    try {
        const userid = req.params.id
        let user = User.findOne(userId);
        return res.status(200).json({
            user,
            success:true
        })
        
    } catch (error) {
        console.log(error);
        
    }
}
export const editProfile = async (req, res) => {
    try {
        const userid = req.id
        let cloudResponse;
        const {bio, gender} = req.body;
        const profilePicture = req.file
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
          cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
        let user = User.findById(userid)
        if (!user) {
            res.status(404).json({
                message:'User not found',
                success:false
            })
        if (bio) {
            user.bio = bio
        }
        if (gender) {
            user.gender = gender
        }
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_url
        }

        await user.save()
        return res.status(200).json({
            message:'Profile uploaded',
            success:true
        })

        }
        
    } catch (error) {
        console.log(error);
        
    }
}

export const getSuggestion = async (req, res) => {
    try {
        const suggestedUser = await User.find({_id:{$ne:req.id}}).select('-password')

        if (suggestedUser) {
            return res.status(400).json({
                message:"currently no users found",
            })
        }
        return res.status(400).json({
            success:true,
            user:suggestedUser
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const followOrUnfolllow = async (req, res) => {
    try {
        const person_who_will_follow = req.id
        const person_who_will_be_followed = req.params.id
        if (person_who_will_be_followed === person_who_will_follow) {
            return res.status(400).json({
                message:"You can't follow yourself",
                success:false
            })
        }
        const user = await User.findById({person_who_will_follow})
        const targetUser = await User.findById({person_who_will_be_followed})
        if (!user || !targetUser) {
            return res.status(400).json({
                message:'User not found',
                success:false
            })
        }
        const isfollowing = await user.following.includes(person_who_will_be_followed)
        if (isfollowing) {
            // unfollow logic
            
         await Promise.all([
                User.updateOne({_id:person_who_will_follow},{$pull:{following:person_who_will_be_followed}}),
                User.updateOne({_id:person_who_will_be_followed},{$pull:{follower:person_who_will_follow}})
        ])

            return res.status(200).json({message:'followed successfully'})
            
        } else{
            //follow logic
            await Promise.all([
                User.updateOne({_id:person_who_will_follow},{$push:{following:person_who_will_be_followed}}),
                User.updateOne({_id:person_who_will_be_followed},{$push:{follower:person_who_will_follow}})
            ])
            return res.status(200).json({message:'followed successfully'})
        }
    } catch (error) {
        console.log(error);
        
    }
}


