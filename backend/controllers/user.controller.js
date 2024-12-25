import {User} from '../models/usermodel.js'
import jwt from 'jsonwebtoken'
import bcyrpt from 'bcryptjs'
import cookieParser from 'cookie-parser';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "Something is missing, please check",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await bcyrpt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      email,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Something is missing, please check",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isMatchedPassword = await bcyrpt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      posts: user.posts,
      followers: user.follower,
      following: user.following,
    };

    const token = jwt.sign({ userid: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userid = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userid).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUsers = await User.find({_id:{$ne:req.id}}).select(
      "-password"
    );

    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently no users found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfolllow = async (req, res) => {
    try {
      const person_who_will_follow = req.id; // Current user's ID
      const person_who_will_be_followed = req.params.id; // Target user's ID
  
      // Prevent a user from following themselves
      if (person_who_will_be_followed === person_who_will_follow) {
        return res.status(400).json({
          message: "You can't follow yourself",
          success: false,
        });
      }
  
      // Find the users by their IDs
      const user = await User.findById(person_who_will_follow);
      const targetUser = await User.findById(person_who_will_be_followed);
  
      // Check if either user is not found
      if (!user || !targetUser) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
  
      // Check if the user is already following the target user
      const isFollowing = user.following.includes(person_who_will_be_followed);
  
      if (isFollowing) {
        // Unfollow logic
        await Promise.all([
          User.updateOne(
            { _id: person_who_will_follow },
            { $pull: { following: person_who_will_be_followed } }
          ),
          User.updateOne(
            { _id: person_who_will_be_followed },
            { $pull: { follower: person_who_will_follow } }
          ),
        ]);
  
        return res.status(200).json({
          message: "Unfollowed successfully",
          success: true,
        });
      } else {
        // Follow logic
        await Promise.all([
          User.updateOne(
            { _id: person_who_will_follow },
            { $push: { following: person_who_will_be_followed } }
          ),
          User.updateOne(
            { _id: person_who_will_be_followed },
            { $push: { follower: person_who_will_follow } }
          ),
        ]);
  
        return res.status(200).json({
          message: "Followed successfully",
          success: true,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server error. Please try again later.",
        success: false,
      });
    }
  };
  

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