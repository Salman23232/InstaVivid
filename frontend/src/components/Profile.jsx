import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit3, Heart, MessageCircle } from "lucide-react";
import EditProfileDialog from "./EditProfileDialog";
import CommentsDialog from "./CommentsDialog";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setFollowers, setFollowings, setIsFollowing } from "@/redux/Authslice";
import { Skeleton } from "./ui/skeleton";
import api from "@/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [saved, setSaved] = useState([]);
  const [reels, setReels] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { userId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const isFollowing = useSelector((state) => state.auth.isFollowing);
  const { followings, followers } = useSelector((state) => state.auth);
  const isMyProfile = user?._id === currentUser?._id;

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = userId
        ? `/user/profile/${userId}`
        : `/user/profile`;
      const { data } = await api.get(endpoint, { withCredentials: true });
    console.log(data);

      setUser(data);
      setPosts(data.posts?.filter((p) => !p.video) || []);
      setReels(data.posts?.filter((p) => p.video) || []);
      setSaved(data.bookmarks || []);
      dispatch(setFollowers(data.follower));
      dispatch(setFollowings(data.following));
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleEdit = () => setOpenEdit(true);
  const openComments = (post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const refetchPost = async (postId) => {
    if (!postId) return;
    try {
      const { data: updatedPost } = await api.get(
        `/post/${postId}`,
        { withCredentials: true }
      );
      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
      setReels((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
      setSelectedPost(updatedPost);
    } catch (err) {
      console.error("Failed to refetch post:", err);
    }
  };

  const handleFollow = async () => {
    try {
      await api.post(
        `/user/follow/${user?._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(setIsFollowing(!isFollowing));
      await fetchProfile();
      toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Follow action failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 md:ml-0 ml-[13%]">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">
          <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
 <div className="max-w-5xl mx-auto px-4 py-8 md:ml-0 ml-[13%] bg-white dark:bg-gray-900 text-gray-900 dark:text-slate-100">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">
        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border border-slate-300 dark:border-slate-600 self-center sm:self-start">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 sm:gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold">{user?.username}</h2>

            {isMyProfile ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 text-sm font-medium border border-slate-300 dark:border-slate-600 px-4 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <EditProfileDialog open={openEdit} refetch={fetchProfile} setOpen={setOpenEdit} user={user} />
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={handleFollow}
                  className="flex items-center gap-2 text-sm font-medium border border-slate-300 dark:border-slate-600 px-4 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <Link
                  to={`/chat/${user?._id}`}
                  className="flex items-center gap-2 text-sm font-medium border border-slate-300 dark:border-slate-600 px-4 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Message
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm sm:text-base text-gray-500 dark:text-slate-400">
            <span><strong className="text-gray-900 dark:text-white">{posts.length + reels.length}</strong> posts</span>
            <span><strong className="text-gray-900 dark:text-white">{followers.length}</strong> followers</span>
            <span><strong className="text-gray-900 dark:text-white">{followings.length}</strong> following</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-slate-400 max-w-xl">
            {user?.bio || "No bio set."}
          </p>
        </div>
      </div>

      <hr className="mb-6 border-t border-gray-200 dark:border-slate-700" />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex justify-center sm:justify-start gap-6 sm:gap-10 bg-transparent mb-6 overflow-x-auto">
          {["posts", "saved", "reels"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="pb-2 text-sm font-medium whitespace-nowrap data-[state=active]:border-b-2 data-[state=active]:text-gray-900 dark:data-[state=active]:text-slate-100 data-[state=active]:border-gray-900 dark:data-[state=active]:border-slate-100"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Posts */}
        <TabsContent value="posts">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="relative aspect-square overflow-hidden group cursor-pointer"
                onClick={() => openComments(post)}
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white gap-4 text-xs sm:text-base transition">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments?.length || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {posts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No posts yet.</p>
          )}
        </TabsContent>

        {/* Saved */}
        <TabsContent value="saved">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4">
            {saved.map((post) => (
              <div
                key={post._id}
                className="aspect-square overflow-hidden cursor-pointer relative"
                onClick={() => openComments(post)}
              >
                {post.image ? (
                  <img src={post.image} alt="Saved Post" className="w-full h-full object-cover" />
                ) : (
                  <video
                    muted
                    loop
                    className="w-full h-full object-cover"
                    ref={(ref) => {
                      if (ref) {
                        ref.onmouseenter = () => ref.play();
                        ref.onmouseleave = () => {
                          ref.pause();
                          ref.currentTime = 0;
                        };
                      }
                    }}
                  >
                    <source src={post.video} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>
          {saved.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No saved posts.</p>
          )}
        </TabsContent>

        {/* Reels */}
        <TabsContent value="reels">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="relative overflow-hidden rounded-lg aspect-[9/16] cursor-pointer group"
                onClick={() => openComments(reel)}
              >
                <video
                  muted
                  loop
                  ref={(ref) => {
                    if (ref) {
                      ref.onmouseenter = () => ref.play();
                      ref.onmouseleave = () => {
                        ref.pause();
                        ref.currentTime = 0;
                      };
                    }
                  }}
                  className="w-full h-full object-cover"
                >
                  <source src={reel.video} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
          {reels.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No reels posted yet.</p>
          )}
        </TabsContent>
      </Tabs>

      <CommentsDialog
        open={dialogOpen}
        setopen={setDialogOpen}
        post={selectedPost}
        refetch={() => refetchPost(selectedPost?._id)}
      />
    </div>
  );
};

export default Profile;
