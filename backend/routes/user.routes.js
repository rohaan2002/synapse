import express from 'express';
import {getUserProfile, suggestedUsers, followUnfollowUser, updateUserProfile} from './../controllers/user.controller.js'
import { protectRoute } from '../middlewares/protectRoute.js';
const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested",protectRoute,suggestedUsers)
router.post("/follow/:id",protectRoute,followUnfollowUser)
router.post("/update",protectRoute,updateUserProfile)

export default router;