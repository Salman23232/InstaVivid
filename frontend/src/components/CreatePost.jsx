import { useState, useRef } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { TbPhotoVideo } from "react-icons/tb";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import api from "@/api";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState(""); // "image" or "video"
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state.auth)
  const navigate = useNavigate();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));

    if (file.type.startsWith("image/")) {
      setMediaType("image");
    } else if (file.type.startsWith("video/")) {
      setMediaType("video");
    } else {
      setMediaType(null);
      toast.error("Unsupported file type.");
    }
  };

  const handlePostCreate = async () => {
    if (!mediaFile || !caption.trim()) {
      toast.error("Caption and media are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append(mediaType, mediaFile); // Fixed field name

      setLoading(true);

      const res = await api.post(
        "/post/addpost",
        formData,
        {
          withCredentials: true,
          headers: {
        "Content-Type": "multipart/form-data",
      },
        }

      );

      if (res.data.success) {
        toast.success("Post added");
        navigate("/");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="p-0 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="w-full h-full bg-white dark:bg-neutral-950">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-center text-base font-semibold tracking-tight">
              Create New Post
            </h2>
          </div>

          {mediaPreview ? (
            <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white dark:bg-neutral-950 shadow-md border border-gray-200 dark:border-neutral-800">
              <div className="w-full md:w-[18rem] aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
                {mediaType === "image" ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Avatar className="ring-2 ring-blue-500 ring-offset-2">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.username}
                  </p>
                </div>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-32 resize-none rounded-xl bg-gray-100 dark:bg-neutral-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                />

                <Button
                  className="w-fit rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm font-semibold shadow-md transition"
                  onClick={handlePostCreate}
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Create Post"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[24rem] gap-4 px-6 py-10 text-center bg-white dark:bg-neutral-950 border border-dashed border-gray-300 dark:border-neutral-800 rounded-xl shadow-sm">
              <TbPhotoVideo
                className="text-gray-400 dark:text-neutral-600"
                size="5rem"
              />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Drag and drop photos or videos
              </p>
              <input
                type="file"
                className="hidden"
                ref={imageRef}
                onChange={fileChangeHandler}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition shadow-sm"
                onClick={() => imageRef.current.click()}
              >
                Select from computer
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
