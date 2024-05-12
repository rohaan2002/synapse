import User from './../models/user.model.js'
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js'
import {v2 as cloudinary} from 'cloudinary';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const createPost=async(req,res)=>{
    try{
        let {text, img} = req.body; 
        const userId = req.user._id.toString(); //as _id is of ObjectId type, we convt it into string

        const user = await User.findById(userId)

        if(!user) return res.status(400).json({error: "User not found"})

        
        if(!text && !img) return res.status(400).json({eror: "Image or/and text required to create post!"})

        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img)
            img= uploadResponse.secure_url
        }
           const newPost = new Post({
            user: userId,
            text,
            img
           }) 

           await newPost.save()

           res.status(200).json(newPost)
    }catch(err){
        console.log("Error in createPost in post controller: ",err);
        res.status(400).json({error: err.message})
    }
}
export const deletePost=async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(400).json({error: "Post not found"})

        if(post.user.toString()!== req.user._id.toString()){
            return res.status(400).json({error: "You can't delete someone else's post."})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0] //'/' ke basis pe split then last wala part liya using pop, then first part lia - gets u the img id out of the whole address of the img
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted successfully!"})
        
    }catch(err){
        console.log("Error in deletePost in post controller: ", err.message);
        res.status(500).json({error: "Internal Server Error in post controller"})
    }

}
export const likeUnlikePost=async(req,res)=>{
    try{
        const userId = req.user._id;
        const postId = req.params.id

        const post = await Post.findById(postId);

        if(!post) return res.status(400).json({error: "Post not found"})

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            // unlike
            await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}})
            await User.findByIdAndUpdate(userId, {$pull:{likedPosts: postId}})
            res.status(200).json({message: "Post unliked successfully!"})
        }
        else{
            // like
            post.likes.push(userId);
            await User.findByIdAndUpdate(userId, {$push:{likedPosts: postId}})
            await post.save()

            const notification = new Notification({
                from: userId,
                to: post.user,
                type:"like"
            })

            await notification.save();

            res.status(200).json({message: "post liked successfully"})
        }
    }catch(err){
        console.log("Error in likeUnlikePost in post controller: ", err.message);
        res.status(500).json({error: "Internal Server Error in post controller"})
    }
}
export const commentOnPost=async(req,res)=>{
    try{
        const {text} = req.body;
        const postId = req.params.id;

        const userId = req.user._id.toString(); //cz wo ._id ka type objectId h

        if(!text) return res.status(404).json({error: "Text is required to comment!"})

        const post = await Post.findById(postId)

        if(!post) return res.status(400).json({error: "Woosh! Post suddenly disappeared"})

        const comment = {user: userId, text}

        post.comments.push(comment);

        await post.save();

        res.status(201).json(post)
    }catch(err){
        console.log("Error in commentOnPost in post controller: ",err.message);
        res.status.json({error: "Internal Server Error in post contoller"})
    }
}

export const getAllPosts=async(req,res)=>{
    try{
        
        // sari posts dikhaega ina order such that createdPost wala atribute's newest value will be displayed on top. that is last createdAt value wali post top pr ayegi

        // populate user wali jo field h usme sirf userId hi jari thi, cz see createUser.
        // populate krne pr jaha uska ref h us document m se pura object le ayega corresp.
        // so userId wale user ki puri info along with fullname, username, profilepic etc store hojayegi user m as an object and not only userId 

        const posts = await Post.find().sort({createdAt: -1}).populate("user")
        
        // agr populate krne ke baad pass htana h to-
        // const posts = await Post.find().sort({createdAt: -1}).populate({
        //     path: "user",
        //     select: "-password"
        // })
        
    
        if(posts.length==0) return res.status(200).json([])
    
        res.status(200).json(posts)
    }catch(err){
        console.log("Error in getAllPosts in post controller: ", err.message);
        res.status(500).json({error: "Internal server error in post controller in getAllPosts"})
    }
}

export const getLikedPosts=async(req,res)=>{
    const userId = req.params.id;
    // const userId = req.user._id; //kyuki m chhta hu sirf khudki ni kisi ki bhi liked post dekh sku

    try{
        const postsLiked = await Post.find({likes: userId}).populate({
            path:"user",
            select: "-password"
        }).populate({
            path:"comments.user",
            select: "-password"
        });

        if(postsLiked.length===0) return res.status(200).json({message: "zero posts liked"})

        res.status(201).json(postsLiked)
    }catch(err){
        console.log("Error in getLikedPosts in post controller: ", err.message);
        res.status(500).json({error: "Internal server error in post controller in getLikedPosts"})
    }
}

export const getFollowingPosts= async(req,res)=>{
    try{
        const userId = req.user._id
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({error: "User not found"})

        const following = user.following;

        // {user: {$in: following}}: This is the query criteria. It's looking for posts where the user field matches any of the values in the following array. The $in operator in MongoDB allows you to specify an array of values to match against.
        const feedPosts = await Post.find({user: {$in: following}}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(feedPosts)
    }catch(err){
        console.log("Error in getFollowingPosts in post controller: ", err.message);
        res.status(500).json({error: "Internal server error in post controller in getFollowingPosts"})
    }
}

export const getUserPosts=async(req,res)=>{
    try{
        const {username} = req.params;

        const user = await User.findOne({username: username})

        if(!user) return res.status(400).json({error: "user not found"})

        const userPosts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(201).json(userPosts)
    }catch(err){
        console.log("Error in getUserPosts in post controller: ", err.message);
        res.status(500).json({error: "Internal server error in post controller in getUserPosts"})
    }
}