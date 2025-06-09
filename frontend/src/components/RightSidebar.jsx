import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "@/redux/Authslice";
import { Skeleton } from "./ui/skeleton";
import api from "@/api";

const RightSidebar = () => {
  const dispatch = useDispatch();
  const { suggestedUsers, followings } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user/suggested", {
          withCredentials: true,
        });
    console.log(res.data);

        const users = res.data.users || [];
        dispatch(setSuggestedUsers(users));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch suggested users");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);

  const handleFollow = async (userId) => {
    const isCurrentlyFollowed = followStatus[userId];

    try {
      const res = await api.post(
        `/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );
    console.log(res.data);

      setFollowStatus((prev) => ({
        ...prev,
        [userId]: !isCurrentlyFollowed,
      }));

      toast.success(isCurrentlyFollowed ? "Unfollowed successfully" : "Followed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Follow action failed");
    }
  };

  return (
    <aside className="w-full max-w-xs bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 md:block hidden text-black dark:text-white">
      <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 dark:border-zinc-700 pb-2">
        Suggested for you
      </h3>

      {loading ? (
        <ul className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-16 rounded-md" />
            </li>
          ))}
        </ul>
      ) : suggestedUsers?.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No suggestions available</p>
      ) : (
        <ul className="space-y-4">
          {suggestedUsers
            ?.filter((user) => !followings?.includes(user._id))
            .map((user) => (
              <li key={user._id} className="flex items-center justify-between">
                <Link to={`/profile/${user._id}`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.profilePicture} alt={user.username} />
                      <AvatarFallback className="bg-gray-300 dark:bg-zinc-700 text-black dark:text-white">
                        {user.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFollow(user._id)}
                  className="text-black dark:text-white border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  {followStatus[user._id] ? "Unfollow" : "Follow"}
                </Button>
              </li>
            ))}
        </ul>
      )}
    </aside>
  );
};

export default RightSidebar;
