import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    productImg:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        required:false
    }
});

const Product= mongoose.model('Product',productSchema);
export default Product;