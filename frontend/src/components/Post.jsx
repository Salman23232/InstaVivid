import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { TbHeartFilled } from "react-icons/tb";
import { BsBookmarkFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import CommentsDialog from "./CommentsDialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import api from "@/api";

const Post = ({ post, refetch }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [followStatus, setFollowStatus] = useState({});
  const videoRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (post && currentUser?._id) {
      setIsLiked(post.likes.includes(currentUser._id));
      setIsBookmarked(post.bookmark?.includes(currentUser._id));
      setLikeCount(post.likes.length);
    }
  }, [post, currentUser]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (video) {
            entry.isIntersecting ? video.play() : video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const handleLike = async () => {
    try {
      const updatedLike = !isLiked;
      setIsLiked(updatedLike);
      setLikeCount((prev) => prev + (updatedLike ? 1 : -1));

      const res = await api.post(
        `/post/like/${post._id}`,
        {}
      );
      console.log(res.data);
      
    } catch (err) {
      toast.error("Failed to update like");
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => prev + (isLiked ? 1 : -1));
    }
  };

  const handleSave = async () => {
    try {
      const updatedBookmark = !isBookmarked;
      setIsBookmarked(updatedBookmark);

      const res = await api.post(
        `/post/bookmark/${post._id}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      
    } catch (err) {
      toast.error("Failed to save post");
      setIsBookmarked((prev) => !prev);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(
        `/post/delete/${post._id}`,
      );
      console.log(res.data);
      
      refetch();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  const handleFollow = async (userId) => {
    const isFollowing = followStatus[userId] || false;
    try {
     const res = await api.post(
        `/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      
      setFollowStatus((prev) => ({
        ...prev,
        [userId]: !isFollowing,
      }));
      toast.success(isFollowing ? "Unfollowed" : "Followed");
    } catch (err) {
      toast.error("Follow action failed");
    }
  };

  const isCaptionLong = post.caption?.split(" ").length > 20;
  const truncatedCaption = post.caption
    ?.split(" ")
    .slice(0, 20)
    .join(" ") + "...";

  return (
    <motion.div
      className="w-full max-w-sm sm:max-w-lg mx-auto mb-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl p-4 transition-all"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Link to={`/profile/${post.author?._id}`} className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage
              src={post.author?.profilePicture}
              className="w-9 h-9 rounded-full"
              alt="@user"
            />
            <AvatarFallback className="w-9 h-9 bg-gray-300 dark:bg-zinc-700 text-sm flex items-center justify-center">
              U
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm text-black dark:text-white">{post.author?.username}</span>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer hover:scale-110 transition text-black dark:text-white" />
          </DialogTrigger>
          <DialogContent className="p-5 space-y-3 text-center dark:bg-zinc-800 dark:text-white">
            {post.author?._id !== currentUser?._id && (
              <Button
                variant="ghost"
                onClick={() => handleFollow(post.author._id)}
                className={`${
                  followStatus[post.author._id] ? "text-blue-500" : "text-red-500"
                } font-semibold w-full`}
              >
                {followStatus[post.author._id] ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Button variant="ghost" className="font-semibold w-full dark:text-white">
              Add to Favorites
            </Button>
            {post.author?._id === currentUser?._id && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-500 font-semibold w-full"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Caption */}
      <div className="mb-2 text-sm text-black dark:text-white">
        {isCaptionLong && !showFullCaption ? (
          <>
            {truncatedCaption}
            <button className="text-blue-500 ml-1" onClick={() => setShowFullCaption(true)}>
              See more
            </button>
          </>
        ) : (
          <>
            {post.caption}
            {isCaptionLong && (
              <button className="text-blue-500 ml-1" onClick={() => setShowFullCaption(false)}>
                See less
              </button>
            )}
          </>
        )}
      </div>

      {/* Media */}
      {post.video ? (
        <motion.video
          ref={videoRef}
          src={post.video}
          loop
          playsInline
          controls={showControls}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={() => setOpenComments(true)}
          className="w-full rounded-lg object-cover cursor-pointer aspect-square mb-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 150 }}
        />
      ) : post.image ? (
        <motion.img
          src={post.image}
          alt="Post"
          onClick={() => setOpenComments(true)}
          className="w-full rounded-lg object-cover cursor-pointer aspect-square mb-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 150 }}
        />
      ) : null}

      {/* Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4">
          <motion.div whileTap={{ scale: 0.9 }}>
            <div onClick={handleLike}>
              {isLiked ? (
                <TbHeartFilled className="w-6 h-6 text-red-500 cursor-pointer" />
              ) : (
                <Heart className="cursor-pointer hover:text-red-500 transition dark:text-white" />
              )}
            </div>
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }}>
            <MessageCircle
              onClick={() => setOpenComments(true)}
              className="cursor-pointer hover:text-blue-500 transition dark:text-white"
            />
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Send className="cursor-pointer hover:text-green-500 transition dark:text-white" />
          </motion.div>
        </div>
        <motion.div whileTap={{ scale: 0.9 }}>
          {isBookmarked ? (
            <BsBookmarkFill
              onClick={handleSave}
              className="w-5 h-5 cursor-pointer text-yellow-500"
            />
          ) : (
            <Bookmark
              onClick={handleSave}
              className="cursor-pointer hover:text-yellow-500 transition dark:text-white"
            />
          )}
        </motion.div>
      </div>

      {/* Likes & Comments */}
      <div className="flex justify-between">
        <p className="text-sm font-semibold mb-2 text-black dark:text-white">{likeCount} Likes</p>
        <span className="text-sm font-semibold mb-2 pr-1 text-black dark:text-white">
          {post.comments?.length} Comments
        </span>
      </div>

      {post.comments.length > 0 && (
        <button
          onClick={() => setOpenComments(true)}
          className="text-sm text-gray-500 hover:underline dark:text-gray-400"
        >
          View all {post.comments.length} comments
        </button>
      )}

      <CommentsDialog
        open={openComments}
        setopen={setOpenComments}
        post={post}
        refetch={refetch}
      />
    </motion.div>
  );
};

export default Post;
