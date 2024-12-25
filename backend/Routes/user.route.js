import express from "express";
import { getProfile, login, logout, register } from "../controllers/user.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuthenticated, getProfile)
router.route('/profile/edit').post(isAuthenticated)