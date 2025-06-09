import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"; // ✅ Correct import path
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { TbHeartFilled } from "react-icons/tb";
import { BsBookmarkFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import CommentsDialog from "./CommentsDialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/api";

const Reels = ({ post, refetch }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [followStatus, setFollowStatus] = useState({});
  const [showFullCaption, setShowFullCaption] = useState(false);
  const videoRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);

  const handleFollow = async (userId) => {
    const isFollowing = followStatus[userId] || false;
    try {
      await api.post(
        `/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      setFollowStatus((prev) => ({
        ...prev,
        [userId]: !isFollowing,
      }));
      toast.success(isFollowing ? "Unfollowed" : "Followed");
    } catch (err) {
      toast.error("Follow action failed");
    }
  };

  const handleLike = async () => {
    try {
      await api.post(
        `/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );
      setIsLiked(!isLiked);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      await api.post(
        `/post/bookmark/${post._id}`,
        {},
        { withCredentials: true }
      );
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(
        `/post/delete/${post._id}`,
        { withCredentials: true }
      );
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (post && currentUser?._id) {
      setIsLiked(post.likes.includes(currentUser._id));
      setIsBookmarked(post.bookmark?.includes(currentUser._id));
    }
  }, [post, currentUser]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (video) {
            if (entry.isIntersecting) {
              video.play();
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.8 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const isCaptionLong = post.caption?.split(" ").length > 20;
  const truncatedCaption =
    post.caption?.split(" ").slice(0, 20).join(" ") + "...";

  return (
    <div className="h-screen max-w-sm aspect-[9/16]  mx-auto md:mt-0  ml-[25%]  md:scale-100 relative bg-black text-white md:flex md:items-center md:justify-center overflow-hidden snap-start">
      {/* Video */}
      <video
        ref={videoRef}
        src={post.video}
        className="absolute w-full h-full object-cover"
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        {/* User Info */}
        <div className="flex items-center justify-between mb-2">
          <Link
            to={`/profile/${post.author?._id}`}
            className="flex items-center gap-3"
          >
            <Avatar>
              <AvatarImage
                src={post.author?.profilePicture}
                className="w-8 h-8 rounded-full"
              />
              <AvatarFallback className="bg-gray-500 text-sm w-8 h-8 flex items-center justify-center">
                U
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm">
              {post.author?.username}
            </span>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              {post.author?._id !== currentUser?._id && (
                <Button
                  onClick={() => handleFollow(post.author._id)}
                  variant="ghost"
                  className="w-full"
                >
                  {followStatus[post.author._id] ? "Unfollow" : "Follow"}
                </Button>
              )}
              {post.author?._id === currentUser?._id && (
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-red-500 w-full"
                >
                  Delete
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Caption */}
        <p className="text-sm mb-1">
          {isCaptionLong && !showFullCaption
            ? `${truncatedCaption} `
            : `${post.caption} `}
          {isCaptionLong && (
            <button
              onClick={() => setShowFullCaption(!showFullCaption)}
              className="text-blue-400"
            >
              {showFullCaption ? "See less" : "See more"}
            </button>
          )}
        </p>

        {/* Action Buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4 text-white">
          <div onClick={handleLike} className="cursor-pointer">
            {isLiked ? (
              <TbHeartFilled className="text-red-500 w-7 h-7" />
            ) : (
              <Heart className="w-6 h-6" />
            )}
            <span className="text-xs">{post.likes.length}</span>
          </div>
          <div onClick={() => setOpenComments(true)} className="cursor-pointer">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">{post.comments.length}</span>
          </div>
          <Send className="w-6 h-6 cursor-pointer" />
          <div onClick={handleSave} className="cursor-pointer">
            {isBookmarked ? (
              <BsBookmarkFill className="text-yellow-400 w-5 h-5" />
            ) : (
              <Bookmark className="w-6 h-6" />
            )}
            <span className="text-xs">{post.bookmark?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <CommentsDialog
        open={openComments}
        setopen={setOpenComments}
        post={post}
        refetch={refetch}
      />
    </div>
  );
};

export default Reels;
