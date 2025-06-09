


  
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/postmodel.js";
import { User } from "../models/usermodel.js";
import {Comment} from "../models/commentmodel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath);


export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.id;

    if (!caption) {
      return res.status(400).json({ success: false, message: "Caption is required" });
    }

    let imageUrl = "";
    let videoUrl = "";

    // Upload image if provided
    if (req.files?.image && req.files.image[0]) {
      const uploadedImage = await cloudinary.uploader.upload(req.files.image[0].path);
      imageUrl = uploadedImage.secure_url;
    }

    // Create new post with placeholder for video
    const newPost = new Post({
      caption,
      author: userId,
      image: imageUrl,
      video: "",
    });

    await newPost.save();

    // 🔥 Add post ID to the user's posts array
    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    // Respond quickly
    res.status(201).json({
      success: true,
      message: "Post created. Video processing will complete soon.",
      post: newPost,
    });

    // Async video processing
    if (req.files?.video && req.files.video[0]) {
      const originalVideoPath = req.files.video[0].path;
      const compressedVideoPath = `compressed-${Date.now()}.mp4`;

      try {
        await new Promise((resolve, reject) => {
          ffmpeg(originalVideoPath)
            .videoCodec("libx264")
            .size("640x?")
            .outputOptions("-crf 28")
            .on("end", resolve)
            .on("error", reject)
            .save(compressedVideoPath);
        });

        // Upload to Cloudinary
        const uploadedVideo = await cloudinary.uploader.upload(compressedVideoPath, {
          resource_type: "video",
          folder: "posts/videos",
        });

        newPost.video = uploadedVideo.secure_url;
        await newPost.save();

        // Clean up temp files
        fs.unlinkSync(compressedVideoPath);
        fs.unlinkSync(originalVideoPath);
      } catch (err) {
        console.error("Video processing/upload failed:", err);
      }
    }

  } catch (error) {
    console.error("Post creation failed:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getPostsOfUser = async(req,res) => {
  try {
    const {userId} = req.params
    const posts = await Post.find({author:userId}).populate('author comments')
    return res.status(200).json(posts)
    
  } catch (error) {
    console.log(error);
    
  }
}
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 }) // 🔥 Recent posts first
      .populate({ path: "author", select: "username profilePicture _id" })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username profilePicture _id" },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const {id} = req.params
    const posts = await Post.findById(id)
      .populate({ path: "author", select: "username profilePicture _id" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture _id" },
      });
    return res.status(200).json(
      posts
    );
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture _id" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture _id" },
      });
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  } 
};

export const likePost = async (req, res) => {
  try {
    const person_who_like = req.id;
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(person_who_like);

    // Fetch the user who is liking the post
    const user = await User.findById(person_who_like).select('username profilePicture _id');

    if (isLiked) {
      // If already liked, remove the like (dislike)
      post.likes.pull(person_who_like);
      await post.save();
      return res.status(200).json({ message: "Post disliked", post });
    } else {
      // If not liked, add like
      post.likes.push(person_who_like);
      await post.save();

      const receiverId = post.author.toString();

      // Only send notification if the post author is not the one who liked
      if (receiverId !== person_who_like.toString()) {
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("notification", {
            type: "like",
            postId,
            by: user, // User who liked the post
            message: `${user.username} liked your post.`
          });
        }
      }

      return res.status(200).json({ message: "Post liked", post });
    }
  } catch (error) {
    console.log("Error in likePost:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const authorId = req.id;

    // Input validation
    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Text is required." });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    // Create the comment
    const comment = await Comment.create({
      text,
      author: authorId,
      post: postId,
    });

    // Add comment reference to post
    post.comments.push(comment._id);
    await post.save();

    // Populate the comment before sending back
    const populatedComment = await Comment.findById(comment._id).populate("author", "username profilePicture _id");

    return res.status(200).json({
      success: true,
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id
        const comments = Comment.find({post:postId}).populate({path:'author', select:'username profilePicture _id'})
        if (!comments) {
            return res.status(404).json({
                message:'No commments found for this post',
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            comments
          });

    } catch (error) {
      console.log(error);
    }
    
  };
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const author = req.id; // assuming this is set by auth middleware

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }

    // Authorization check
    if (post.author.toString() !== author) {
      return res.status(403).json({ message: 'Unauthorized', success: false });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Remove post reference from the user
    const user = await User.findOne({ posts: postId });
    if (user) {
      user.posts = user.posts.filter(id => id.toString() !== postId);
      await user.save();
    }

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};


  
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const author = req.id;

    const post = await Post.findById(postId).populate("author");
    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    const user = await User.findById(author).select("username profilePicture bookmarks _id");
    const alreadyBookmarked = user.bookmarks.includes(post._id);

    if (alreadyBookmarked) {
      user.bookmarks.pull(post._id);
      post.bookmark.pull(author);
      await user.save();
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post removed from bookmark",
        type: "unsaved",
      });
    } else {
      user.bookmarks.push(post._id);
      post.bookmark.push(author);
      await user.save();
      await post.save();

      // Send notification if it's not their own post
      if (user._id.toString() !== post.author._id.toString()) {
        const notification = {
          type: "bookmark",
          user,
          post,
          message: `${user.username} bookmarked your post`,
        };

        const receiverSocketId = getReceiverSocketId(post.author._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("notification", notification);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Post bookmarked",
        type: "saved",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
