import { User } from "../models/usermodel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
        
        
    } catch (error) {
        console.log(error);
        
    }
}