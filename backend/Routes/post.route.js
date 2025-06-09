import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  getAllPost,
  getCommentsOfPost,
  getPostById,
  getPostsOfUser,
  getUserPost,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.route('/addpost').post(
  isAuthenticated,
  upload.fields([
    { name: 'image' },
    { name: 'video' }
  ]),
  addNewPost
);

router.route('/all/').get(getAllPost);
router.route('/:id').get(getPostById);
router.route('/userpost/all').get(getUserPost);
router.route('/like/:id').post(likePost);
router.route('/user/:userId').get(getPostsOfUser)
router.route('/comment/:id').post(addComment);
router.route('/comment/all/:id').get(getCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated, deletePost);
router.route('/bookmark/:id').post(bookmarkPost);

export default router;
