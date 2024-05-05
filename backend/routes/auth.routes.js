import express from 'express';
import {signup, login , logout, getMe} from './../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/protectRoute.js';
const router = express.Router();

// add route for getMe
router.get("/getme", protectRoute,getMe)
router.post("/signup",signup )
router.get("/login", login)
router.get("/logout", logout)

export default router;