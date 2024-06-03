import mongoose from "mongoose";

const userScheme=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImg:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    isDeleted:{
        type:Boolean,
        required:false
    }
});
const User =mongoose.model("User",userScheme);
export default User;