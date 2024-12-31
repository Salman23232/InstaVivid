import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import CommentsDialog from "./CommentsDialog";
import { useState } from "react";

const Post = () => {
  const [state, setstate] = useState("")
  const [open, setopen] = useState(false)
  const onchangeHandler = (e) =>{
    const inputText = e.target.value
    if (inputText.trim()) {
      setstate(inputText)
    }else(
      setstate('')
    )
  }
  return (
    <div className="w-full max-w-sm mx-auto mb-5">
      {/* Header Section with Avatar and Username */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="w-8 h-8 rounded-full"
            />
            <AvatarFallback className="w-8 h-8 rounded-full bg-gray-200 text-sm">
              CN
            </AvatarFallback>
          </Avatar>
          <h1 className="text-sm font-medium">Username</h1>
        </div>

        {/* Dialog Trigger for Post Options */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          {/* Dialog Content with Post Actions */}
          <DialogContent className="flex flex-col items-center space-y-2 text-sm text-center p-4">
            <Button
              variant="ghost"
              className="cursor-pointer w-full text-red-600 font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-full font-bold">
              Add to Favorites
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-full text-red-600 font-bold"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="my-2 aspect-square rounded-sm object-cover w-full"
        src="https://images.unsplash.com/photo-1733919504961-2d6314e90089?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
      <div className="flex justify-between mb-2">
        <div className="flex gap-3 items-center">
          <Heart className="cursor-pointer hover:text-gray-600"/>
          <MessageCircle onClick={()=> setopen(true)} className="cursor-pointer hover:text-gray-600"/>
          <Send className="cursor-pointer hover:text-gray-600"/>
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600"/>
      </div>
      <span className="font-medium mb-2">1k Likes</span>
      <p>
        <span className="font-medium">username</span>
        caption
      </p>
      <button onClick={()=> setopen(true)} >View all 10 comments</button>
      <CommentsDialog open={open} setopen={setopen}/>
      <div className="flex items-center justify-between">
        <input type="text" placeholder="Add a comment..." className="outline-none text-sm w-full"  value={state} onChange={onchangeHandler}/>
        {
          state && <input type="submit" value="Post" className="text-blue-500"/>
        }
      </div>
    </div>
  );
};

export default Post;
