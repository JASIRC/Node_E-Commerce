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
        required:true,
        default:false
    },
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"
    }],
    wishList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"wishList"
    }]
});
const User = mongoose.model("User",userScheme);
export default User;