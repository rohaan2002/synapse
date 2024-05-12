import express from 'express'
import { createPost, deletePost, likeUnlikePost, commentOnPost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts} from '../controllers/post.controller.js'
import { protectRoute } from '../middlewares/protectRoute.js'
const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create",protectRoute, createPost);
router.delete("/:id",protectRoute, deletePost);
router.post("/like/:id",protectRoute, likeUnlikePost);
router.post("/comment/:id",protectRoute, commentOnPost);
router.get("/likedposts/:id",protectRoute, getLikedPosts);
// router.get("/likedposts",protectRoute, getLikedPosts);

export default router