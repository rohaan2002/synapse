import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary'

// models
import User from "../models/user.model.js";
import Notif from "../models/notification.model.js"
export const getUserProfile=async(req,res)=>{
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

export const followUnfollowUser=async(req,res)=>{
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

export const getSuggestedUsers=async(req,res)=>{
    try{
        const userId = req.user._id;

        const UsersFollowedByMe = await User.findById(userId).select("following"); //selected current user's whole following list/array of users (users current user follow)

        const users = await User.aggregate([
            {
                $match: {
                    _id :{$ne: userId}  //_id for the "users" should be NOT EQUAL(ne) to userId (khud na ho wo user unn selected users m se)
                 }
            },
            {
                $sample:{size: 10} // 10 user nikalo User se, given wo match condition apply hori ho
            }
        ])

        const filteredUsers =  users.filter(user=>!UsersFollowedByMe.following.includes(user._id));
        // const filteredUsers =  users.filter(user=>!UsersFollowedByMe); 
        //wont this do THE SAME THING??? whats the point in checking if your followed users have you in their following? they'd have you obv!!
        // BUT LATTER DOESNT WORK !!!!!!!!!

        const suggestedUsers = filteredUsers.slice(0,4);  //shuru ke 4 dedo filteredUsers m se - 0,1,2,3 - last index is excluded

        suggestedUsers.forEach((user)=> (user.password = null));

        return res.status(200).json(suggestedUsers);

    }catch(err){
        console.log("error in suggestedUsers in user.controller: ", err.message);
        res.status(500).json({error: `Internal Server Error-  ${err.message}`})
    }
}


export const updateUser=async(req,res)=>{
    const {fullname,email, username,  currentPassword, newPassword, bio, link} = req.body;

    let {profileImg, coverImg} = req.body;
    const userId = req.user._id;

    try{
        let user = await User.findById(userId);

        if(!user) return res.status(400).json({error: "User not found"})
   
        if((!currentPassword && newPassword)||(currentPassword && !newPassword)){
            return res.status(400).json({error: "Either current or new password is missing. Provide both."})
        }
    
        if(currentPassword && newPassword){
        const isMatch =  await bcrypt.compare(currentPassword, user.password )

        if(!isMatch)  return res.status(400).json({error: "Incorrect current password."})

        if(newPassword.length<6){
            return res.status(400).json({error: "Password should be atleast 6 digit long."})
        }
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(newPassword,salt )
        }
        if(profileImg){
            if(user.profileImg){
                // agr phle se img pdhi h to use delete krenge phle tb jake nyi update krenge DB m

                // FOR EX: user.profileImg =
                // https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg

                await cloudinary.uploader.destroy(user.profileImg.split('/')[7].split('.')[0])
                // doing this we get id of the img => "sample" from the url we have from 'user.profileImg'

            }
            const uploadResponse=await cloudinary.uploader.upload(profileImg)
            profileImg = uploadResponse.secure_url;
        }

        if(coverImg){
            if(user.coverImg){
                     // agr phle se img pdhi h to use delete krenge phle tb jake nyi update krenge DB m

                // FOR EX: user.coverImg =
                // https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg

                await cloudinary.uploader.destroy(user.coverImg.split('/')[7].split('.')[0])
                // doing this we get id of the img => "sample" from the url we have from 'user.coverImg'

            }
             const uploadResponse = await cloudinary.uploader.upload(coverImg);
             coverImg = uploadResponse.secure_url;
        }

        user.fullname = fullname || user.fullname //if we get a 'fullname' from req.body, then we'll update it in DB else, use the one we have in DB already
        // SAME WITH OTHERS
        user.username= username || user.username,
        user.email = email || user.email
        user.link = link || user.link
        user.bio = bio || user.bio
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        await user.save(); // updated user with all the changes saved in DB;
        
        user.password = null; //user already saved so this nulling is done so that password isnt revealed in the res

        return res.status(201).json(user); //user khud obj h to curly m dalne ki jrurt ni
     
    }catch(err){
        console.log("Error in updateUser controller", err.message);
        res.status(400).json({error: `Internal Server Error in updateUser: ${err.message}`})
    }
}