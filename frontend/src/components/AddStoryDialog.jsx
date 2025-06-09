// AddStoryDialog.jsx
import { useState, useRef } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { TbPhotoVideo } from "react-icons/tb";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import toast from "react-hot-toast";
import axios from "axios";

const AddStoryDialog = ({ open, setOpen, fetchStories, currentUser }) => {
  const inputRef = useRef();
  const [storyFile, setStoryFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStoryFile(file);
    setPreview(URL.createObjectURL(file));

    if (file.type.startsWith("image/")) {
      setMediaType("image");
    } else if (file.type.startsWith("video/")) {
      setMediaType("video");
    } else {
      setMediaType(null);
      toast.error("Only image or video is allowed.");
    }
  };

  const handleAddStory = async () => {
    if (!storyFile) {
      toast.error("Please select a media file.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(mediaType, storyFile);

      const res = await axios.post(
        "https://localhost:8000/api/v1/story",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Story uploaded");
        fetchStories?.();
        setOpen(false);
        setStoryFile(null);
        setPreview("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-lg"
      >
        <div className="bg-white dark:bg-neutral-950">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-center text-base font-semibold">
              Add a New Story
            </h2>
          </div>

          {preview ? (
            <div className="p-6 flex flex-col gap-5">
              <div className="aspect-square w-full rounded-xl overflow-hidden border shadow-sm">
                {mediaType === "image" ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="ring-2 ring-blue-500 ring-offset-2">
                  <AvatarImage src={currentUser?.profilePicture} />
                  <AvatarFallback>
                    {currentUser?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  @{currentUser?.username || "you"}
                </p>
              </div>

              <Button
                className="w-fit bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg shadow"
                onClick={handleAddStory}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Story"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 gap-4 p-8 text-center border border-dashed border-gray-300 dark:border-neutral-800 rounded-xl shadow-sm">
              <TbPhotoVideo className="text-gray-400 dark:text-neutral-600" size="4rem" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Drag and drop media or select from your device
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                ref={inputRef}
                className="hidden"
                onChange={fileChangeHandler}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow"
                onClick={() => inputRef.current.click()}
              >
                Select Media
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStoryDialog;
