import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/Authslice";
import { toast } from "sonner";
import api from "@/api";

const EditProfileDialog = ({ refetch, open, setOpen , user}) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [profilePic, setProfilePic] = useState(
    user.profilePicture
  );
  const [newPicFile, setNewPicFile] = useState(null);
  const dispatch = useDispatch();
  const data = new FormData();
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewPicFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
        data.append('bio',bio)
        data.append('username',username)
        data.append('image',file)
  };

const saveProfileHandler = async () => {
  const data = new FormData();
  data.append("username", username);
  data.append("bio", bio);
  if (newPicFile) {
    data.append("profilePicture", newPicFile); // Only append file if updated
  }

  try {
    const res = await api.put("/user/profile/edit", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data) {
      toast.success("Profile updated");
    console.log(res.data);
      dispatch(setAuthUser(res.data));
      refetch()
      setOpen(false)
    }
  } catch (error) {
    console.log("Profile update failed:", error.response?.data || error.message);
    toast.error("Failed to update profile");
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[380px] w-full p-4 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-lg"
        onInteractOutside={() => setOpen(false)}
      >
        <section className="flex flex-col bg-white dark:bg-neutral-950 p-4 rounded-lg overflow-auto max-h-[75vh]">
          {/* Profile Picture and Upload */}
          <div className="flex flex-col items-center gap-4 mb-5">
            <Avatar className="w-24 h-24 rounded-full ring-4 ring-blue-500 flex justify-center items-center">
              <AvatarImage src={profilePic}  className="rounded-full"/>
              <AvatarFallback className="bg-blue-400 dark:bg-neutral-700 text-3xl font-bold text-gray-600 dark:text-gray-300 h-24 w-24 rounded-full flex justify-center items-center">
                {user.username[0]}
              </AvatarFallback>
            </Avatar>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profile-pic-upload"
              className="cursor-pointer px-3 py-1.5 bg-blue-600 text-sm rounded-md hover:bg-blue-700 transition"
            >
              Change Picture
            </label>
          </div>

          {/* Header with avatar + username + menu */}


          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProfileHandler();
            }}
            className="flex flex-col gap-4"
          >
            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-xs font-medium mb-1 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                required
              />
            </motion.div>



            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col"
            >
              <label className="block text-xs font-medium mb-1 dark:text-gray-300">
                Bio
              </label>
              <textarea
                value={bio}
                placeholder="update your bio...."
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </motion.div>

            {/* Save Button */}
            <motion.div whileTap={{ scale: 0.95 }} className="mt-3">
              <Button
                type="submit"
                className="w-full rounded-lg px-4 py-2 shadow-md bg-blue-500 text-sm"
              >
                Save Changes
              </Button>
            </motion.div>
          </form>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
