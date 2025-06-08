import express from "express";
import { editProfile, followOrUnfolllow, getAllUser, getMe, getProfile, getSuggestedUser, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/all').get(getAllUser)
router.route('/profile').get(isAuthenticated, getMe)
router.route('/profile/:id').get(isAuthenticated, getProfile) 
router.route('/profile/edit').put(isAuthenticated,upload.single('image'), editProfile)

router.route('/suggested').get(isAuthenticated, getSuggestedUser)
router.route('/follow/:id').post(isAuthenticated, followOrUnfolllow)

export default router