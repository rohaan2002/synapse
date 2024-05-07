import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
// next is used to give control to the next function specified for that route. eg.,
// in router.get("/getme", protectRoute, getMe) , after protectRoute execution, the control will be passed to getMe to execute itself 
export const protectRoute=async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;

        if(!token) return res.status(400).json({error: "Unauthorized: JWT Token not found."})

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(400).json({error: "Unauthorized: Invalid Token."})
        } 
            

        console.log(User);

        const user = await User.findById(decoded.userId).select("-password") //note that jwt token had a payload - userId (see in utils/generateToken.js)

        if(!user) return res.status(400).json({error: "User not found!"})

        req.user = user //we're adding a user attribute in req objectthis way, as theres no "user" attribute/data coming in req (request object)
        // this "user" contains all credentials of loggedin/authorized/signedup user except password.

        next();    //now getMe can access this user from req object using req.user - req.user._id , req.user.fullname etc
    }catch(err){
        console.log("Error in protectRoute middleware: ",err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}