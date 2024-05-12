import Notif from "../models/notification.model.js";

export const getNotifs=async(req,res)=>{
    try{
        const userId = req.user._id;
    
        const notifs = await Notif.find({to: userId}).populate({
            path: "from",
            select: "username profileImg"
        })

        await Notif.updateMany({to: userId},{read: true})  // us Notif m jiske to m userId h, uske read ko true krdo

        res.status(200).json(notifs)
         
    }catch(err){
        console.log("Error in notif controller: ", err.message);
        res.status(500).json({error: "Internal Server Error in getNotif in notif controller"})
    }
}

export const deleteNotif=async(req,res)=>{
    try{
        const userId = req.user._id;

        // jitni bhi notif user ko bheji hongi wo SARI delete hongi..!
        await Notif.deleteMany({to: userId});

        res.status(200).json({message: "Notifications deleted successfully!"})

    }catch(err){
        console.log("Error in notif controller: ", err.message);
        res.status(500).json({error: "Internal Server Error in deleteNotif in notif controller"})
    }
}

export const deleteOneNotif=async(req,res)=>{
    try{
        const {notifId} = req.params;
        const userId = req.user._id
    
        const notif = await Notif.findbyId(notifId)
    

        if(!notif) return res(400).json({message: "Notif doenst exist"})

        if(notif.to.toString()!==userId.toString()){
            return res.status(403).json({message:"Can't delete someone else's notification"})
        }
    
        await Notif.findByIdAndDelete(notifId)
    
        res.status(200).json({message: "this one notification is deleted!"})

    }
    catch(err){
        console.log("Error in notif controller: ", err.message);
        res.status(500).json({error: "Internal Server Error in deleteOneNotif in notif controller"})
    }

}