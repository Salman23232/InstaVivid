import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/postmodel.js";
import { User } from "../models/usermodel.js";


export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userid = req.id;
    const image = req.file;
    if (!image)
      res.status(400).json({ success: false, message: "image is required" });
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
    const post = Post.create({
      caption,
      image: cloudinaryResponse.secure_url,
      author: userid,
    });
    const user = await User.findById(userid);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(200).json({
      message: "New post added",
      status: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" },
      });
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" },
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
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    //   like logic
    await post.updateOne({ $addToSet: { likes: person_who_like } });
    await post.save();

    //implementing socket.io for realtime notfication
    return res.status(200).json({
        success: true,
        message:'Post liked'
      });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
    try {
      const person_who_like = req.id;
      const postid = req.params.id;
      const post = await Post.findById(postid);
      if (!post)
        return res
          .status(404)
          .json({ success: false, message: "Post not found" });
      //   like logic
      await post.updateOne({ $pull: { likes: person_who_like } });
      await post.save();
  
      //implementing socket.io for realtime notfication
      return res.status(200).json({
          success: true,
          message:'Post liked'
        });
    } catch (error) {
      console.log(error);
    }
  };

export const addComment = async (req, res) => {
    try {
        const person_who_will_comment = req.id

      const postid = req.params.id
      const {text} = req.body
      const post = Post.findById(postId)
      if(!text) return res.status(404).json({success:false, message:'text is required'})
    const comment = await Comment.create({
            text,
            author:person_who_will_comment,
            post: postid
    
        }).populate({path:'author', select:'username, profilePicture'})
    post.comments.push(comment._id)
    await post.save()
    return res.status(200).json({
        success: true,
        message:'Comments added'
      });
    } catch (error) {
      console.log(error);
    }
    
  };

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id
        const comments = Comment.find({post:postId}).populate({path:'author', select:'username, profilePicture'})
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
    const postId = req.params.id
    const author = req.id
    const post = Post.findById(postId)
    if(!post) return res.status(404).json({messsage:'post not found', success: false})

    //authorization check

    if (post.author.toString() !== author) {
        return res.status(403).json({messsage:'Not Authorized to delete this post', success: false})
    }
    
    // delete the post
    await Post.findByIdAndDelete(postId)

    //delete post from the user's post array also
    let user = User.findById(postId)
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    // delete associated comments
    await Comment.deleteMany({post:postId});

    return res.status(200).json({
        success: true,
        message:'Post deleted'
      });

    } catch (error) {
      console.log(error);
    }
    
  };

  export const bookmarkPost  = async (req, res) => {
    try {
    const postId = req.params.id
    const author = req.id
    const post = Post.findById(postId)
    if(!post) return res.status(404).json({messsage:'post not found', success: false})

    //authorization check

    if (post.author.toString() !== author) {
        return res.status(403).json({messsage:'Not Authorized to delete this post', success: false})
    }
    const user = User.findById(author)
    if (user.bookmarks.includes(post._id)) {
        //already bookmarked => remove bookmark
        await user.updateOne({$pull:{bookmarks:post._id}})
        await user.save()
        return res.status(200).json({
            success: true,
            message:'post removed from bookmark',
            type: 'unsaved'
          });
    } else {
        //bookmark it

        await user.updateOne({$addToSet:{bookmarks:post._id}})
        await user.save()
        return res.status(200).json({
            success: true,
            message:'post bookmarked',
            type: 'saved'
          });
    }

    } catch (error) {
      console.log(error);
    }
    
  };