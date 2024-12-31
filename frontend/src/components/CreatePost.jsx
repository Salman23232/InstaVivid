import React, { useState, useRef } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { TbPhotoVideo } from "react-icons/tb";
import { readFileAsDataURL } from "@/lib/utils"; // Assuming this is a utility function for reading file as Data URL
import { Button } from "./ui/button";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [imgFile, setImgFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [filter, setFilter] = useState(""); // Holds the currently applied filter class

  const filterList = [
    { filtername: "imgIvory", name: "Ivory" },
    { filtername: "imgAden", name: "Aden" },
    { filtername: "imgClarendon", name: "Clarendon" },
    { filtername: "imgCrema", name: "Crema" },
    { filtername: "imgGingham", name: "Gingham" },
    { filtername: "imgJuno", name: "Juno" },
    { filtername: "imgLark", name: "Lark" },
    { filtername: "imgLudwig", name: "Ludwig" },
    { filtername: "imgMoon", name: "Moon" },
  ];

  // File change handler for image preview
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      const dataUrl = await readFileAsDataURL(file); // Convert the file to a Data URL
      setImagePreview(dataUrl); // Set image preview URL
    }
  };

  // Function to handle post creation logic
  const handlePostCreate = () => {
    // Add your post creation logic here (e.g., upload the image, save the caption, etc.)
    setOpen(false); // Close the dialog after post creation
  };

  // Function to change the filter
  const changeFilter = (filtername) => {
    setFilter(filtername); // Update the applied filter class
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className={`p-1 transition-all duration-500 ${imagePreview? 'scale-x-[1.7] scale-y-[1.4]': 'scale-100' }`}
      >
        <div>
          {/* Header */}
          <div className={`font-normal p-1 flex justify-center transition-all duration-500 ${imagePreview? 'scale-75': 'scale-100' }`}>
            <p >Create new post</p>
          </div>
          <hr className="border-b-1 border-gray-400" />

          {/* Image and Filters Section */}
          {imagePreview ? (
            <div className="flex items-center gap-2">
              {/* Image preview with applied filter */}
              <img
                src={imagePreview}
                alt="Preview"
                className={`w-[20rem] h-80 object-cover rounded-t-lg mb-4 ${filter}`}
              />

              <div className="flex flex-col items-center justify-between">
                <div className="tabs flex justify-between gap-10 pb-4">
                    <button className="tab text-[.5rem]">Filter</button>
                    <button className="tab text-[.5rem]">Adjustment</button>
                    <button className="tab text-[.5rem]">Post</button>
                </div>
                {/* Filter Buttons */}
              <div className="flex flex-wrap w-[11rem] items-start gap-2 mb-20">
                {filterList.map((filterObj) => (
                  <Button
                    key={filterObj.filtername}
                    className={`filter-btn text-[.4rem] w-[3.2rem] h-[3.2rem] rounded-none ${filter === filterObj.filtername ? filterObj.filtername : 'bg-blue-300'}`}
                    style={{
                        backgroundImage: `url('')`, // Use your own image URL here
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    onClick={() => changeFilter(filterObj.filtername)}
                  >
                    {filterObj.name}
                  </Button>
                ))}
              </div>
              <div>
              <button 
                className="w-20 h-8 text-[.7rem] bg-blue-500 rounded text-white"
                onClick={handlePostCreate}
              >
                Create Post
              </button>
              </div>
              </div>

              {/* Create Post Button */}
              
            </div>
          ) : (
            <div className="h-80 flex flex-col gap-3 justify-center items-center">
              <TbPhotoVideo
                className="transition-opacity duration-[60s] opacity-100 text-gray-300"
                size={"10rem"}
              />
              <span className="text-xl">Drag photos and videos here</span>
              <input
                type="file"
                className="hidden"
                ref={imageRef}
                onChange={fileChangeHandler}
              />
              <button
                className="p-2 bg-blue-500 rounded-lg text-white"
                onClick={() => imageRef.current.click()}
              >
                Select from your computer
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
