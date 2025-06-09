

// story.routes.js
import express from "express";
import {
  createStory,
  getStories,
  viewStory,
  deleteStory,
} from "../controllers/story.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const storyRoutes = express.Router();

storyRoutes
  .route("/")
  .get(getStories)
  .post(isAuthenticated, upload.fields([{ name: "image" }, { name: "video" }]), createStory);

storyRoutes.get("/view/:id", viewStory);
storyRoutes.delete("/:id", isAuthenticated, deleteStory);

export default storyRoutes;

