import mongoose from 'mongoose'

const connectMongoDB = async()=>{
    try{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected! with host: ",conn.connection.host);
    }catch(err){
        console.log("Error connecting to MongoDB: ", err.message);
        process.exit(1);
    }
}

export default connectMongoDB;