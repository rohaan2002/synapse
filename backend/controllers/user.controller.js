import User from "../models/user.model.js";
import Notif from "../models/notification.model.js"
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

export const followUnfollowUser=async(req,res,next)=>{
   const {id}= req.params;
   try{
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id); //the "user" was added as an attribute to req in using " req.user = user" - see in protectRoute

    if(id===req.user._id.toString()) return res.status(400).json({error: "Can't follow/unfollow yourself smarty-pants!"})

    const isFollowing = currentUser.following.includes(id);
    // OR
    // const isFollowing = userToModidfy.followers.includes(id); //same thing

    if(isFollowing){
        // unfollow
        await User.findByIdAndUpdate(id, {$pull:{followers: req.user._id}})
        await User.findByIdAndUpdate(req.user._id,{$pull: {following: id}})

// TODO return the id of the user as a response

        res.status(200).send({message: "Unfollowed successfully!"})
    }else{
        //follow  
        await User.findByIdAndUpdate(id, {$push:{followers: req.user._id}});
        // jisko follow kia h (id) uski followers m push hogya jisne (you - req.user._id) follow kia h
        await User.findByIdAndUpdate(req.user._id, {$push: {following: id}})
        // jisne follow kia h (req.user._id) uski following m push hogya jisko follow kia h (id)

        const newNotif = new Notif({
            from: currentUser._id,
            to: userToModify._id,
            type: 'follow',

        });

        await newNotif.save()
// TODO return the id of the user as a response

        res.status(200).send({message: "User Followed successfully!"})


    }
   }catch(err){
        console.log("Error in followUnfollow in user controller: ", err.message);
        res.status(500).json({error: `Internal Server Error - ${err.message}`})

   }
}

export const getSuggestedUsers=async(req,res,next)=>{
    try{
        const userId = req.user._id;

        const UsersFollowedByMe = await User.findById(userId).select("following"); //selected current user's whole following list/array of users (users current user follow)

        const users = await User.aggregate([
            {
                $match: {
                    _id :{$ne: userId}  //_id for the "users" should be NOT EQUAL(ne) to userId (khud na ho wo user un selected users m se)
                 }
            },
            {
                $sample:{size: 10} // 10 user nikalo User se, given wo match condition apply hori ho
            }
        ])

        const filteredUsers =  users.filter(user=>!UsersFollowedByMe.following.includes(user._id));
        // const filteredUsers =  users.filter(user=>!UsersFollowedByMe); 
        //wont this do THE SAME THING??? whats the point in checking if your followed users have you in their following? they'd have you obv!!

        const suggestedUsers = filteredUsers.slice(0,4);  //shuru ke 4 dedo filteredUsers m se - 0,1,2,3 - last index is excluded

        return res.status(200).json(suggestedUsers);

    }catch(err){
        console.log("error in suggestedUsers in user.controller: ", err.message);
        res.status(500).json({error: `Internal Server Error-  ${err.message}`})
    }
}




export const updateUserProfile=(req,res,next)=>{
    res.send("get user hitted")
}