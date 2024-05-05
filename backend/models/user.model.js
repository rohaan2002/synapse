import mongoose from "mongoose";

// IMP INFO---------------------
// type: mongoose.Schema.Types.ObjectId: This line defines the data type of the field as an ObjectId. ObjectId is a data type used in MongoDB to uniquely identify documents in a collection. It's typically used as a reference to documents in other collections.

// ref: "User": This line establishes a reference between the field and another Mongoose model, in this case, the "User" model. It tells Mongoose that the values stored in these fields are references to documents in the "User" collection. By specifying this reference, Mongoose knows that when you populate these fields, it should fetch the corresponding documents from the "User" collection based on the ObjectId stored in the field
// -----------------------------

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    email: {
      type: String,
      unique: true,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    profileImg: {
      type: String,
      default: "",
    },

    coverImg: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema)

export default User