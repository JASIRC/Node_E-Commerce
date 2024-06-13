import Razorpay from "razorpay";
import dotenv from 'dotenv';
import User from "../Schema/UserSchema.js";
import crypto from 'crypto'

dotenv.config();

export const payment = async(req,res,next)=>{
    try{
        const userid=req.params.userid;
        const user = await User.findById(userid).populate({
            path:"cart",
            populate:{path:"productId"}
        });

        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        const cartProduct= user.cart

        if(cartProduct.lenght==0){
            return res.status(404).json({message:"Cart is Empty"})
        }
        let totalAmount=0;
        let totalQuantity=0;

        cartProduct.forEach((item)=>{
            totalAmount+=item.productId.price*item.quantity
            totalQuantity+=item.quantity;
        })

        const razorpay = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        });
        
        try{
            const payment = await razorpay.orders.create({
                amount:totalAmount*100,
                currency:"INR",
                receipt:`receipt_order_${userid}`,
                payment_capture:1
            });
            return res.json({
                status:"Success",
                message:"Payment Initiated",
                data:payment
            });
        }catch(razorpayError){
            return res.status(500).json({
                error:"Failed to Create Razorpay Order",
                details:razorpayError.message
            })
        }
    }catch(error){
        return next(error)
    }
}



