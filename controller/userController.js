import User from "../Schema/UserSchema.js";
import userjoi from "../validation/userValidation.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"


    // User Signup

export const signup=async(req,res,next)=>{
    try{
        // Validating incoming request using the Joi schema
        const{value,error}=userjoi.validate(req.body);
        // Handle validation error
        if(error){
            return res.status(400).json({Details:error})
        }

        // Extract Data
        const {username,email,password}=value;

        // Check if user already exists 
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email Already Registered"});
        }

        // Hash password
        const hashpassword= await bcrypt.hash(password,10)

        // Create a new user and save it to the database
        const newUser=new User({
            username,
            email,
            password:hashpassword,
            profileImg:req.cloudinaryImageUrl
        });

        //  Save the new user
        await newUser.save()

        // Successfully created the user
        return res.status(201).json({message:"User Created Successfully",data:newUser});
    }catch(error){
        res.status(422).json({message:"Validation Error",Details:error});
        next(error);
    };
};


    // User Login

export const login = async(req,res,next)=>{
    try{
        // Access Req.Body
        const{email,password}=req.body;
        
        // Using findOne to get a single user document
        const validUser=await User.findOne({email});
        if(!validUser){
            res.status(404).json({message:"User Not Found"})
        }

        //Check if the account is blocked
        if(validUser.isDeleted==true){
            res.status(400).json({message:"Your Account is Suspended"})
        }

        // Compare the provided password with the hashed password
        const inValid=bcrypt.compareSync(password,validUser.password);
        if(!inValid){
            res.status(401).json({message:"Password Incorrect"})
        }

        //JWT Settings
        const token =Jwt.sign({id:validUser._id},process.env.USER_JWT_SECRET_KEY);
        const {password:hashpassword,...rest}=validUser._doc;
        const expiryDate=new Date(Date.now()+60*1000);

        // cookie setting
        res.cookie('access_token',token,{httpOnly:true,expires:expiryDate});
        res.status(200).json({message:"Successfully Login",token,data:rest})
    }catch(error){
        next(error);
    }
}    