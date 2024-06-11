// authController.js
import User from '../models/usermodel.js';
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../lib/utils/generateTokenAndSetCookie.js';
export const signup = async (req, res) => {
    try{
      const{fullName,username,email,password} = req.body;
      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email format"});
           
        }
        const existinguser = await User.findOne({username});
        if(existinguser){
            return res.status(400).json({error:"Username is already taken"});
        }
        const existingemail = await User.findOne({email});
        if(existingemail){
            return res.status(400).json({error:"Email is already pressent"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName:fullName,
            username: username,
            email: email,
            password:hashpassword
        })
        if(newUser){
          generateTokenAndSetCookie(newUser._id,res)
          await newUser.save();
          res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
          })
        }
        else{
           res.status(400).json({error:"Invalid user data"});
        }
    }
    catch(error){
      res.status(500).json({error:`${error}`});
    }
};

export const login = async (req, res) => {
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || " ");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
          })
    } catch (error) {
        console.log("Error in Login ",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt"," ",{maxAge:0})
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error:"Internal Server Error "});
    }
};
export const getMe = async(req,res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log( `${error}`,error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
    
}
