import Jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import User from "../Schema/UserSchema.js";
dotenv.config();

export const adminLogin = async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token =Jwt.sign({email}, process.env.ADMIN_JWT_SECRET_KEY);

            res.cookie('access_token',token,{httpOnly:true})
            .status(200).json({message:"Admin Login Successfully", token})
        }else{
            return res.status(404).json({message:"Unauthorized"})
        }
    }catch(error){
        return next(error)
    }
};


export const viewAllUser =async(req,res,next)=>{
    try{
        const user=await User.find()
        if(!user){
            return res.status(404).json({message:"User's not Found"})
        }
        return res.status(200).json({message:"Successfully Fetched User's Data",Data:user})
    }catch(error){
        return next(error)
    }
};



export const viewSpecificUser=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({message:"User not Found"})
        }
        return res.status(200).json({message:"Successfully Fetched User Data", Data:user})
    }catch(error){
        return next(error)
    }
};



export const viewUserNameWise=async (req,res,next)=>{
    try{
        const name=req.params.name;
        const user=await User.find({
            username:{$regex:new RegExp(name,"i")}
        });
        if(user.length==0){
            return res.status(404).json({message:"User Not Found"})
        }
        return res.status(200).json({message:"Successfully Fetched User Data", Data:user})
    }catch(error){
        return next(error)
    }
}



export const userBlockandUnblock=async(req,res,next)=>{
    try{
        const id= req.params.id
        const user=await User.findById(id)
        if(!user){
            return res.status(404).json({message:"User not Found"})
        }
        if(user.isDeleted==false){
            (user.isDeleted=true)
            await user.save()
            return res.status(200).json({message:"Blocked...!"})
        }else{
            (user.isDeleted=false)
            await user.save()
            return res.status(200).json({message:"UnBlocked...!"})
        }
    }catch(error){
        return next(error)
    }
}



export const deleteUser =async(req,res,next)=>{
    try{
    const id= req.params.id
    const user=await User.findByIdAndDelete(id)
    if(!user){
        return res.status(404).json({message:"User not Found"})
    }
    res.status(200).json({message:"User Deleted"})
    }catch(error){
        return next(error)
    }
}