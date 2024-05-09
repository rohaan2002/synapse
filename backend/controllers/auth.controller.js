import User from './../models/user.model.js'
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';
const validateEmail = (email)=>{
  let atPos = email.indexOf('@');
  let dotPos = email.lastIndexOf('.');
  
  return ( atPos>0 && dotPos > atPos+1 && dotPos< email.length -1);
}

export const signup = async(req,res)=>{
    try{
      const {fullname, username, email, password} = req.body;
      
      if(!validateEmail(email)) return res.status(400).json({error:"Invalid Email!"})

      const existingUser = await User.findOne({username})
     if(existingUser) return res.status(400).json({error: "Username already exists!"}); 

      const existingEmail = await User.findOne({email})
     if(existingEmail) return res.status(400).json({error: "Email already exists!"}); 

     if(password.length<6){
      return res.status(400).json({error: "Password length is lesser than 6 characters!"})
     }
    //  Hashing the password
     const salt = await bcrypt.genSalt(10);
     const hashedPass = await bcrypt.hash(password, salt)

     //mongoose schema ka use krke naya User bnalia DB m save krne ke liye
     const newUser = new User({   
      username,
      fullname,
      email,
      password: hashedPass

      // baki fields ki value default hi rhega

     })

     if(newUser){
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        username:  newUser.username,
        fullname:  newUser.fullname,
        email:  newUser.email,
        password:  newUser.password,
        coverImg:  newUser.coverImg,
        profileImg:  newUser.profileImg,
        bio:  newUser.bio,
        username:  newUser.username,
        followers:  newUser.followers,
        following:  newUser.following
      })
     }

    }catch(err){
      res.status(500).json({error: "User data is invalid"+`${err}`})
    }
}

export const login = async(req,res)=>{
    try{
      const {username, password} = req.body;
      const user = await User.findOne({username});  //findOne and findById are mongoDB functions. diff is findOne takes an object, findById just value

      const isPassCorrect = await bcrypt.compare(password, user?.password || "")

      if(!user||!isPassCorrect){
        return res.status(400).json({error: "Username or password is incorrect! Enter correct ones."})
      }

      generateTokenAndSetCookie(user._id, res);

      res.status(200).json({
        _id:  user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg
      });

    }catch(err){
      console.log("Something wrong in login controller: ", err.message);
      res.status(500).json({error: "Internal Server Error"})
    }
}

export const logout = async(req,res)=>{
 try{
  res.cookie("jwt", "", {maxAge: 0})
  res.status(200).json({message: "Logged out successfully"})
 }catch(err){
  console.log("Error in Logout Controller", err.message);
  res.status(500).json({error: "Internal Server Error"})
 }
}

export const getMe= async(req,res)=>{
  try{
    const user = await User.findById(req.user._id)
    res.status(200).json(user)
  }catch(err){
    console.log("Error occured in getMe controller", err.message);
    res.status(500).json("Internal Server Error");

  }
}