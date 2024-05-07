import User from "../models/user.model.js";

export const getUserProfile=async(req,res,next)=>{
   const {username} = req.params;
   try{
    const user = await User.findOne({username}).select("-password")

    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    res.status(200).json(user);
   }catch(err){
    res.status(500).json({error: err.message})
   }
}


export const suggestedUsers=(req,res,next)=>{
    res.send("get user hitted")
}


export const followUnfollowUser=async(req,res,next)=>{
   const {id}= req.params;
   try{
    const userToModidfy = await User.findById(id);
    const currentUser = await User.findById(req.user._id); //the "user" was added as an attribute to req in using " req.user = user" - see in protectRoute

    if(id===req.user._id.toString()) return res.status(400).json({error: "Can't follow/unfollow yourself smarty-pants!"})

    const isFollowing = currentUser.following.includes(id);
    // OR
    // const isFollowing = userToModidfy.followers.includes(id); //same thing

    if(isFollowing){
        // unfollow
        await User.findByIdAndUpdate(id, {$pull:{followers: req.user._id}})
        await User.findByIdAndUpdate(req.user._id,{$pull: {following: id}})

        res.status(200).send({message: "Unfollowed successfully!"})
    }else{
        //follow  
        await User.findByIdAndUpdate(id, {$push:{followers: req.user._id}});
        // jisko follow kia h (id) uski followers m push hogya jisne (you - req.user._id) follow kia h
        await User.findByIdAndUpdate(req.user._id, {$push: {following: id}})
        // jisne follow kia h (req.user._id) uski following m push hogya jisko follow kia h (id)
        res.status(200).send({message: "User Followed successfully!"})
    }
   }catch(err){
        console.log("Error in followUnfollow in user controller: ", err.message);
        res.status(500).json({error: `Internal Server Error - ${err.message}`})

        // send notif to the user
   }
}


export const updateUserProfile=(req,res,next)=>{
    res.send("get user hitted")
}