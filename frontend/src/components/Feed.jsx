import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddStoryDialog from "./AddStoryDialog";
import Posts from "./Posts";
import api from "@/api";

const Feed = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await api.get("/story");
      setStories(res.data);
    } catch (err) {
      console.error("Failed to load stories:", err);
    }
  };

  const handleStoryClick = async (story) => {
    setSelectedStory(story);
    setProgress(0);
    try {
      await axios.get(`/story/view/${story._id}`);
    } catch (err) {
      console.error("Failed to mark story as viewed:", err);
    }
  };

  useEffect(() => {
    let interval;
    if (selectedStory) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSelectedStory(null);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [selectedStory]);

  return (
    <div className="flex-1 w-full max-w-[900px] ml-[12%] mx-auto px-4 sm:px-6 lg:px-20 py-4">
      {/* Story Preview Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] rounded-lg p-0 overflow-hidden">
          {selectedStory && (
            <div className="relative bg-black text-white w-full">
              <div className="absolute top-0 left-0 h-1 w-full bg-gray-700">
                <div
                  ref={progressRef}
                  className="h-full bg-white transition-all duration-100 linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2 p-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedStory.userId?.profilePicture} />
                  <AvatarFallback>
                    {selectedStory.userId?.username?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">
                  {selectedStory.userId?.username}
                </span>
              </div>
              {selectedStory.mediaType === "video" ? (
                <video
                  src={selectedStory.media}
                  autoPlay
                  controls
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : (
                <img
                  src={selectedStory.media}
                  alt="story"
                  className="w-full max-h-[70vh] object-cover"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stories Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 overflow-x-auto no-scrollbar"
      >
        <div className="flex gap-4 px-1 sm:px-2 md:px-4 lg:px-0">
          {/* Add Story */}
          <div
            onClick={() => setOpen(true)}
            className="flex flex-col items-center text-center cursor-pointer min-w-[64px]"
          >
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-[2px]">
              <Avatar className="w-full h-full">
                <AvatarImage src={currentUser?.profilePicture} />
                <AvatarFallback>
                  {currentUser?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                <Plus className="w-4 h-4 text-black" />
              </div>
            </div>
            <span className="text-xs mt-1 font-medium capitalize max-w-[60px] truncate">
              Your Story
            </span>
          </div>

          {/* All stories */}
          {stories.map((story) => (
            <div
              key={story._id}
              onClick={() => handleStoryClick(story)}
              className="flex flex-col items-center cursor-pointer min-w-[64px]"
            >
              <Avatar className="w-16 h-16 ring-2 ring-blue-500">
                <AvatarImage src={story.userId?.profilePicture} />
                <AvatarFallback>
                  {story.userId?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs mt-1 max-w-[60px] truncate">
                {story.userId?.username}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Story Dialog */}
      <AddStoryDialog
        open={open}
        setOpen={setOpen}
        fetchStories={fetchStories}
        currentUser={currentUser}
      />

      {/* Posts Feed */}
      <Posts />
    </div>
  );
};

export default Feed;
