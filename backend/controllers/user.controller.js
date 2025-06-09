import {User} from '../models/usermodel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/postmodel.js';

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

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      email,
    });

const token = jwt.sign({ userid: newUser._id }, process.env.SECRET_KEY, {
  expiresIn: "1d",
});

res.cookie("token", token, {
  httpOnly:true,
  sameSite: "none",
  secure: true,  
  maxAge: 86400000,
}).json({
  success: true,
  message: "Account created successfully",
  user: newUser, // optional
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

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const token = jwt.sign({ userid: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });


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

    return res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure:true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      }).json({
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

    const user = await User.findById(userid)
    .populate({path:'bookmarks',populate:[
      {
            path: 'author',
            select: 'username profilePicture',
          },
          {
            path: 'comments',
            populate: {
              path: 'author',
              select: 'username profilePicture',
            }
      
   } ]})
      .populate({
        path: 'posts',
        populate: [
          {
            path: 'author',
            select: 'username profilePicture',
          },
          {
            path: 'comments',
            populate: {
              path: 'author',
              select: 'username profilePicture',
            },
          },
        ],
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const { query } = req.query;

    const searchFilter = query
      ? {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchFilter).populate("posts");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};


export const editProfile = async (req, res) => {
  try {
    const userid = req.id;
    const { bio, username } = req.body;
    const profilePicture = req.file?.path

    const user = await User.findById(userid).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }


    if (bio) user.bio = bio;
    if (username) user.username = username;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    return res.status(200).json(
      user);
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async (req, res) => {
  const userId = req.id;

  const user = await User.findById(userId)
  .populate({path:'bookmarks',populate:[
      {
            path: 'author',
            select: 'username profilePicture',
          },
          {
            path: 'comments',
            populate: {
              path: 'author',
              select: 'username profilePicture',
            }
      
   } ]})
    .populate({
      path: 'posts',
      populate: [
        {
          path: 'author',
          select: 'username profilePicture',
        },
        {
          path: 'comments',
          populate: {
            path: 'author',
            select: 'username profilePicture',
          },
        }
      ]
    });

  return res.status(200).json(user);
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
  const followerId = req.id; // Logged-in user
  const followeeId = req.params.id; // User to follow/unfollow

  if (followerId === followeeId) {
    return res.status(400).json({ message: "You can't follow yourself", success: false });
  }

  const user = await User.findById(followerId);
  const targetUser = await User.findById(followeeId);

  if (!user || !targetUser) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const isFollowing = user.following.includes(followeeId);

  if (isFollowing) {
    // Unfollow
    await Promise.all([
      User.updateOne({ _id: followerId }, { $pull: { following: followeeId } }),
      User.updateOne({ _id: followeeId }, { $pull: { follower: followerId } }),
    ]);
    return res.status(200).json({ message: "Unfollowed successfully", success: true });
  } else {
    // Follow
    await Promise.all([
      User.updateOne({ _id: followerId }, { $push: { following: followeeId } }),
      User.updateOne({ _id: followeeId }, { $push: { follower: followerId } }),
    ]);
    return res.status(200).json({ message: "Followed successfully", success: true });
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