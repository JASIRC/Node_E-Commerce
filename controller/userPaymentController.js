import Razorpay from "razorpay";
import dotenv from 'dotenv';
import User from "../Schema/UserSchema.js";
import crypto from 'crypto'
import Orders from "../Schema/orderSchema.js";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
});


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

        const options = {
            amount: totalAmount * 100, // convert to paise (smallest currency unit in INR)
            currency: "INR",
            receipt: `receipt_order_${userid}`,
            notes:{
              userid: userid,
            },
            payment_capture: 1,
          };
      
          try {
            const payment = await razorpay.orders.create(options);
      
            return res.json({
              status: "success",
              message: "Payment initiated", 
              data: payment,
            });
          } catch (razorpayError) {
            console.error("Razorpay Error:", razorpayError);
            return res.status(500).json({
              error: "Failed to create Razorpay order",
              details: razorpayError.message,
            });
          }
        } catch (error) {
          console.error("Server Error:", error);
          next(error);
        }
};


export const verifyPayment = async (req, res) => {
    try {
      
      const key_secret = process.env.key_secret;
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
      const expectedSignature = crypto.createHmac("sha256", key_secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
         .digest("hex");
  
  
  

      if (razorpay_signature !== expectedSignature) {
        return res.status(400).json({ status: "failure", message: "Invalid signature" });
      }
      const Order = await razorpay.orders.fetch(razorpay_order_id);
      
      const user = await User.findById(Order.notes.userid).populate({path:"cart",populate:{path:"productId"}});
  
      const orderItems = user.cart.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      }));
  
      const totalamount = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
      const order = new Orders({
        userId: user._id,
        products: orderItems,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        totalPrice: totalamount,
        totalItem: orderItems.length
      });
      
  
      await order.save();
  
      // Clear user's cart
      user.cart = [];
      await user.save();
  
      return res.status(200).json({ status: "success", message: "Order placed successfully", order });
    } catch (error) {
      console.error("Error in VerifyPayment:", error);
      return res.status(500).json({ status: "error", message: "Internal server error", error: error.message});
    }
  };  
      








