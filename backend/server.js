import express from 'express';
import authroutes from './routes/auth.routes.js'
import cors from 'cors'
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongo.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())  //JSON Parsing: It enables the Express.js application to automatically parse JSON data sent in the body of HTTP requests. When a request is received by the server, if it contains JSON data in its body (checked by content-type: application/json), this middleware parses the JSON data and exposes it in the req.body property of the request object.
app.use(express.urlencoded({extended:true})); //to parse form data
app.use(cookieParser());

app.use("/api/auth", authroutes)


app.get("/" , (req,res)=>{
    res.send("yooooooooooooooo")
    console.log("Hello there, server is ready!");
})

app.listen(8000, ()=>{
    console.log(`Server up and running on port ${PORT}`);
    connectMongoDB();
})