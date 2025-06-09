import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";


const router = express.Router();

router.route('/send/:id').post(sendMessage)
router.route('/all/:id').get(getMessage)


export default router