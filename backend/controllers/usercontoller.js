import  User  from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  Post  from "../models/postModel.js";
import getDataUri from "../middlewares/getDataurl.js";
import cloudinary from "../middlewares/cloudinary.js"
//Register user
export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "All Fields are required ! please check ?",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Try different email...",
        success: false,
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newuser = new User({
      username,
      email,
      password: hashedpassword,
    });
    await newuser.save();
    return res.status(200).json({
      message: "User Regiseted successfully...",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are Required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrecr Email or Password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrecr Email or Password",
        success: false,
      });
    }
    //create a token each user login
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    //populate user post
    const populatedPost = [];
    for (const postId of user.posts) {
      const post = await Post.findById( postId );
      if (post.author === user._id) {
        populatedPost.push(user._id)
        return populatedPost
      }
    }
     const result={
        _id:user._id,
        username:user.name,
        email:user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: populatedPost
    }
    return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
        message: `Welcome back ${user.username}`,
        success: true,
        user:result
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout=async(req,res)=>{
    try {
       return res.cookie("token","").status(200).json({
        message:"Loggedout suucessfull",
        success:true
       }) 
    } catch (error) {
       console.log(error) 
    }
}
export const getMyProfile=async(req,res)=>{
    try {
        const userId=req.params.id;
        const user=await User.findById(userId).populate({path:'posts','createdAt':-1}).populate('bookmarks').select("-password")
        if(!user){
            return res.status(401).json({
                message:"ther is no user",
                success:false
            })
        }
        return res.status(200).json({
            message:"successfully fetched data",
            success:true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}
export const editprofile=async(req,res)=>{
  const userId=req.id;
  try {
    const {bio,gender}=req.body;
    const profilePicture=req.file;
    let cloudphotoData;
    if(profilePicture){
      const fileUrl=getDataUri(profilePicture);
      cloudphotoData=await cloudinary.uploader.upload(fileUrl)
    }
    const user=await User.findById(userId).select("-password");
    if(!user){
      return res.status(401).json({
        message:"User not found...",
        success:false
      })
    }
    if(bio) user.bio=bio;
    if(gender) user.gender=gender;
    if(profilePicture) user.profilePicture=cloudphotoData.secure_url;
    await user.save();
    return res.status(200).json({
      message:"User Edited successfully..",
      success:true
    })
  } catch (error) {
    console.log(error)
  }
}
export const otherUsers=async(req,res)=>{
  try {
   const otheruser=await User.find({_id:{$ne:req.id}}).select("-password") ;
   if(!otheruser){
    return res.status(401).json({
      message:"Do not have any users....",
      success:false
    })
  
   }
   return res.status(200).json({
    message:"successfully fetched data",
    success:true,
    users:otheruser
  })
  } catch (error) {
    console.log(error)
  }
}
export const followOrUnfollow = async (req, res) => {
  try {
    const userId = req.id;
    const targetUserId = req.params.targetUserId; // Extract targetUserId from req.params
    
    if (userId === targetUserId) {
      return res.status(401).json({
        message: "You cannot follow or unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(userId).select("-password");
    const targetUser = await User.findById(targetUserId).select("-password");

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(targetUserId); // Check if user is already following the target user

    if (isFollowing) {
      // Unfollow logic
      await User.updateOne(
        { _id: userId },
        { $pull: { following: targetUserId } }
      );
      await User.updateOne(
        { _id: targetUserId },
        { $pull: { followers: userId } }
      );

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      // Follow logic
      await User.updateOne(
        { _id: userId },
        { $push: { following: targetUserId } }
      );
      await User.updateOne(
        { _id: targetUserId },
        { $push: { followers: userId } }
      );

      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};
