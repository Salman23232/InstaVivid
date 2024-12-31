import React, { useState, useRef } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { TbPhotoVideo } from "react-icons/tb";
import { readFileAsDataURL } from "@/lib/utils"; // Utility for reading file as Data URL
import { Button } from "./ui/button";
import { assets } from "@/assets/asset.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [imgFile, setImgFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imgfilter, setImgFilter] = useState(""); // Holds the currently applied filter class
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [fade, setFade] = useState(0);
  const [saturation, setSaturation] = useState(100);

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
    setOpen(false); // Close the dialog after post creation
  };

  // Function to change the filter
  const changeFilter = (filtername) => {
    setImgFilter(filtername); // Update the applied filter class
  };

  const [toggle, setToggle] = useState(1);
  const toggleTab = (index) => {
    setToggle(index);
  };

  // Dynamic style for adjustments
  const getAdjustmentStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) opacity(${100 - fade}%)`,
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className={`p-1 transition-all duration-500 ${
          imagePreview ? "scale-x-[1.7] scale-y-[1.4]" : "scale-100"
        }`}
      >
        <div>
          {/* Header */}
          <div
            className={`font-normal p-1 flex justify-center transition-all duration-500 ${
              imagePreview ? "scale-75" : "scale-100"
            }`}
          >
            <p>Create new post</p>
          </div>
          <hr className="border-b-1 border-gray-400" />

          {/* Image and Filters Section */}
          {imagePreview ? (
            <div className="flex items-center gap-2">
              {/* Image preview with applied filter and adjustments */}
              <img
                src={imagePreview}
                alt="Preview"
                className={`w-[20rem] h-80 object-cover rounded-t-lg mb-4 ${imgfilter}`} // Apply the selected filter class
                style={getAdjustmentStyle()} // Combine the filter class with dynamic style
              />

              <div className="flex flex-col items-center justify-between">
                <div className="tabs flex justify-between gap-8 p-2">
                  <button
                    className="tab text-[.6rem]"
                    onClick={() => toggleTab(1)}
                  >
                    Filter
                  </button>
                  <button
                    className="tab text-[.6rem]"
                    onClick={() => toggleTab(2)}
                  >
                    Adjustment
                  </button>
                  <button
                    className="tab text-[.6rem]"
                    onClick={() => toggleTab(3)}
                  >
                    Post
                  </button>
                </div>
                {/* Filter Buttons */}
                <div className="flex flex-wrap w-[11rem] items-start gap-2 mb-20">
                  {filterList.map((filterObj) => (
                    <div className={toggle === 1 ? "block" : "hidden"} key={filterObj.filtername}>
                      <Button
                        className={`filter-btn text-[.4rem] w-[3.2rem] h-[4.45rem] rounded-none ${
                          imgfilter === filterObj.filtername
                            ? "border-2 border-blue-500"
                            : ""
                        }`}
                        style={{
                          backgroundImage: `url(${assets[filterObj.name]})`, // Dynamically select image from assets
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        onClick={() => changeFilter(filterObj.filtername)} // Apply the selected filter
                      >
                        {filterObj.name}
                      </Button>
                    </div>
                  ))}

                  {/* Adjustment Sliders */}
                  <div className={toggle === 2 ? "block" : "hidden"}>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center">
                        <label className="mr-2 text-sm">Brightness</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={brightness}
                          onChange={(e) => setBrightness(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="mr-2 text-sm">Contrast</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={contrast}
                          onChange={(e) => setContrast(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="mr-2 text-sm">Fade</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={fade}
                          onChange={(e) => setFade(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="mr-2 text-sm">Saturation</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={saturation}
                          onChange={(e) => setSaturation(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Post Section */}
                  <div className={toggle === 3 ? "block" : "hidden"}>
                    <div className="flex-ro h-[2rem] w-full justify-between">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                          className="w-6 h-7 rounded-full"
                        />
                        <AvatarFallback className="w-6 h-7 rounded-full bg-gray-200 text-sm">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-[.7rem] pt-1">bio here..</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <textarea
                        name=""
                        className="outline-none w-[10rem] h-[9rem] text-[.7rem]"
                        placeholder="Write a caption....."
                        id=""
                      ></textarea>

                      <input
                        className="text-[.7rem] outline-none"
                        placeholder="Add alt text"
                      />

                      <Button
                        className="text-[.7rem] text-blue-500"
                        variant="ghost"
                        onClick={handlePostCreate}
                      >
                        Create Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
