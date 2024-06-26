import express from 'express';
import path from'path';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notifRoutes from './routes/notif.routes.js'
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongo.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve()

app.use(express.json({limit:"5mb"}))  //JSON Parsing: It enables the Express.js application to automatically parse JSON data sent in the body of HTTP requests. When a request is received by the server, if it contains JSON data in its body (checked by content-type: application/json), this middleware parses the JSON data and exposes it in the req.body property of the request object.
app.use(express.urlencoded({extended:true})); //to parse form data
app.use(cookieParser());  // to parse cookie, now u can access it from req.cookie object directly

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifs", notifRoutes)

// if(process.env.NODE_ENV==="production"){
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));

//     app.get("*",(req,res)=>{
//         res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
//     })
// }
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
})

app.listen(PORT, ()=>{
    connectMongoDB();
    console.log(`Server up and running on port ${PORT}`);
})