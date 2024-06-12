import User from "../Schema/UserSchema.js";
import cart from "../Schema/cartSchema.js";
import Product from "../Schema/productSchema.js";


export const addCart=async (req,res,next)=>{
    try{
        const userid=req.params.userid;
        const productid=req.params.productid;

        const user= await User.findById(userid);
        if(!user){
            res.status(404).json({message:"User not Found"})
        }
        if(user.isDeleted==true){
            res.status(400).json({message:"Your Account is Suspended"})
        }

        const product = await Product.findById(productid);
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }

        let cartItem= await cart.findOne({userId:user._id,productId:product._id});
        if(cartItem){
            res.status(200).json({message:"Product Already Added in the Cart"})
        }else{
            cartItem=await cart.create({
                userId:user._id,
                productId:product._id,
                quantity:1
            });
            user.cart.push(cartItem._id)
            await user.save()
            res.status(200).json({message:"The Product has been Successfully added to your Cart..."})
        }
    }catch(error){
        return next(error);
    }
};


export const viewCart=async(req,res,next)=>{
    try{
        const id = req.params.userid;
        console.log(id);
        const user= await User.findById(id).populate({
            path:'cart',
            populate:{ path:'productId'}
        })
        console.log(user);
        if(!user){
            res.status(404).json({message:"User not found"})
        }
        if(!user.cart || user.cart.length===0){
            res.status(200).json({message:"Cart is Empty"})
        }
        res.status(200).json(user.cart);
    }catch(error){
        next(error)
    }
};



export const removeCart=async (req,res,next)=>{
    try{
        const userid=req.params.userid;
        const productid=req.params.productid;
console.log(userid);
console.log(productid);
        const user=await User.findById(userid)
        if(!user){
            res.status(404).json({message:"User not Found"});
        }

        const product = await Product.findById(productid)
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }
        const cartitem = await cart.findOneAndDelete({userId:user._id,productId:product._id})
        if(!cartitem){
            res.status(404).json({message:"Product not Found in the Cart"})
        }
        const cartitemIndex= await user.cart.findIndex(item=>item.equals(cartitem._id));
        if(cartitemIndex!==-1){
            user.cart.splice(cartitemIndex,1)
            await user.save();
        }
        res.status(200).json({message:"Product Removed Successfully"});
    }catch(error){
        return next(error)
    }
};


export const increment= async (req,res,next)=>{
    try{
        const userid=req.params.userid
        const productid=req.params.productid
        const user= await User.findById(userid)
        if(!user){
            res.status(404).jsom({message:"User not Found"})
        }
        const product= await Product.findById(productid)
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }
        let Item= await cart.findOne({userId:user._id,productId:product._id});
        if(Item){
            Item.quantity ++
            await Item.save();
            res.status(200).json({message:"Quantity Incremented"})
        }else{
            res.status(404).json({message:"Product not Found in the Cart"})
        }
    }catch(error){
        return next(error)
    }
}


export const decrement = async (req,res,next)=>{
    try{
        const userid=req.params.userid
        const productid=req.params.productid

        const user = await User.findById(userid)
        if(!user){
            res.status(404).json({message:"User not Found"})
        }
        const product = await Product.findById(productid)
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }
        let Item=await cart.findOne({userId:user._id,productId:product._id})
        if(Item){
            Item.quantity--
            await Item.save();
            res.status(200).json({message:"Quantity Decremented"})
        }else{
            res.status(404).json({message:"Product not Found in the Cart"})
        }
    }catch(error){
        return next(error)
    }
}