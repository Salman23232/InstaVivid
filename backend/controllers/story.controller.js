import Story from "../models/story.model.js";
import cloudinary from "../utils/cloudinary.js";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export const createStory = async (req, res) => {
  try {
    const userId = req.id;
    let media
    let mediaType

    // If image provided, upload to Cloudinary
    if (req.files?.image && req.files.image[0]) {
      const uploadedImage = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "stories/images",
      });
      media = uploadedImage.secure_url;
      mediaType = 'image'
    }

    // Respond fast, handle video asynchronously if present
    const newStory = new Story({
      userId,
      media,
      mediaType,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newStory.save();

    res.status(201).json({
      success: true,
      message: "Story created. Video processing will complete soon if included.",
      story: newStory,
    });

    // Handle video upload and compression
    if (req.files?.video && req.files.video[0]) {
      const originalVideoPath = req.files.video[0].path;
      const compressedVideoPath = `compressed-story-${Date.now()}.mp4`;

      try {
        await new Promise((resolve, reject) => {
          ffmpeg(originalVideoPath)
            .videoCodec("libx264")
            .size("640x?")
            .outputOptions("-crf 28")
            .on("end", resolve)
            .on("error", reject)
            .save(compressedVideoPath);
        });

        const uploadedVideo = await cloudinary.uploader.upload(compressedVideoPath, {
          resource_type: "video",
          folder: "stories/videos",
        });

        newStory.media = uploadedVideo.secure_url;
        newStory.mediaType = "video";
        await newStory.save();

        fs.unlinkSync(originalVideoPath);
        fs.unlinkSync(compressedVideoPath);
      } catch (err) {
        console.error("Video processing/upload failed:", err);
      }
    }
  } catch (err) {
    console.error("Story creation failed:", err);
    res.status(500).json({ success: false, message: "Failed to create story", error: err.message });
  }
};



// GET /api/v1/story
export const getStories = async (req, res) => {
  try { 
    const stories = await Story.find({
      expiresAt: { $gt: new Date() },
    })
      .populate("userId", "_id username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stories", error: err.message });
  }
};

// PATCH /api/v1/story/view/:id
export const viewStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }

    res.status(200).json(story);
  } catch (err) { 
    res.status(500).json({ message: "Failed to update viewers", error: err.message });
  }
};

// DELETE /api/v1/story/:id
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.userId.equals(req.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Story.findByIdAndDelete(id);
    res.status(200).json({ message: "Story deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete story", error: err.message });
  }
};
