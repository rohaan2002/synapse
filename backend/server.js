import express from 'express';
import authroutes from './routes/auth.routes.js'
import cors from 'cors'
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authroutes)


app.get("/" , (req,res)=>{
    res.send("yooooooooooooooo")
    console.log("Hello there, server is ready!");
})

app.listen(8000, ()=>{
    console.log(`Server up and running on port ${PORT}`);
    connectMongoDB();
})