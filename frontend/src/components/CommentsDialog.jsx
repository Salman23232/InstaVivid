import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import api from "@/api";

const CommentsDialog = ({ open, setopen, post, refetch }) => {
  const [text, setText] = useState("");
  const [saveCount, setSaveCount] = useState(0);

  const onChangeHandler = (e) => {
    setText(e.target.value.trimStart());
  };

  const sendMessageHandler = async () => {
    try {
      const res = await api.post(
        `/post/comment/${post._id}`,
        { text },
        { withCredentials: true }
      );
    console.log(res.data);

      refetch();
      setText("");
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent
        className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden rounded-3xl border border-gray-200 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[90vh]"
        onInteractOutside={() => setopen(false)}
      >
        {/* Optional Close Button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setopen(false)}
          className="absolute top-2 right-2 z-50"
        >
          ✕
        </Button>

        <section className="flex flex-col md:flex-row h-[80vh] bg-white dark:bg-neutral-950">
          {/* Image/Video Section */}
          <div className="w-full md:w-1/2 h-64 md:h-full group overflow-hidden">
            {post?.image === "" ? (
              <motion.video
                src={post?.video}
                loop
                autoPlay
                playsInline
                controls
                className="w-full h-full object-cover cursor-pointer aspect-square mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 150 }}
              />
            ) : (
              <img
                src={post?.image}
                alt="Post"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <Link to="#">
                  <Avatar>
                    <AvatarImage
                      src={post?.author?.profilePicture}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full ring-2 ring-offset-2 ring-blue-500"
                    />
                    <AvatarFallback className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200">
                      {post?.author?.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link
                  to="#"
                  className="text-sm font-semibold hover:underline hover:text-blue-600 transition"
                >
                  {post?.author?.username}
                </Link>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-black dark:hover:text-white" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center space-y-2 text-sm text-center p-4">
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-full text-red-600 font-bold"
                  >
                    Unfollow
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-full font-bold"
                  >
                    Add to Favorites
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar max-h-[40vh] md:max-h-full">
              {post?.comments?.map((comment, i) => (
                <motion.div
                  key={comment._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-3 items-start"
                >
                  <Avatar>
                    <AvatarImage
                      src={comment?.author?.profilePicture}
                      className="w-8 h-8 rounded-full"
                    />
                    <AvatarFallback className="w-8 h-8 rounded-full bg-gray-200">
                      {comment?.author?.username?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="relative bg-gray-100 dark:bg-neutral-800 p-3 rounded-xl shadow-md max-w-sm text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment?.author?.username}
                    </span>
                    <p className="mt-1 text-gray-600 dark:text-gray-300 break-words">
                      {comment?.text}
                    </p>
                    <div className="absolute left-[-8px] top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100 dark:border-r-neutral-800" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Section */}
            <div className="border-t border-gray-200 dark:border-neutral-800 p-4 flex items-center gap-3 bg-white/90 dark:bg-black/40 backdrop-blur-lg">
              <input
                value={text}
                onChange={onChangeHandler}
                className="w-full px-4 py-2 text-sm bg-gray-100 rounded-lg dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                type="text"
                placeholder="Add a comment..."
              />
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={sendMessageHandler}
                  disabled={!text.trim()}
                  className="rounded-lg px-6 shadow-md bg-blue-500"
                >
                  Send
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
