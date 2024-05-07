import mongoose from "mongoose";
import User from "./user.model.js";

const notifSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required:true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required:true
    },
    type:{
        type:String,
        required: true,
        enum: ["like","follow"]
    },
    read:{
        type: Boolean,
        default: false

    }
}, {timestamps: true});

const Notif = mongoose.model("Notif", notifSchema)

export default Notif