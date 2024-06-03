import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userToken=(req,res,next)=>{
    try{
        const token = req.headers["authorization"];
        if(!token){
            res.status(403).json({message:'Token is not Provided'});
        }
        Jwt.verify(token,process.env.USER_JWT_SECRET_KEY,(err,decode)=>{
            if(err){
                res.status(401).json({message:"UnAuthorized"});
            }
            req.email=decode.email;
            next()
        }); 
    }catch(error){
        return next(error);
    }
};