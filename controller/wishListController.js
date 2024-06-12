import User from "../Schema/UserSchema.js";
import Product from "../Schema/productSchema.js";
import wishList from "../Schema/wishlistSchema.js";


export const addWishList=async(req,res,next)=>{
    try{
        const userId = req.params.userid;
        const productId=req.params.productid;

        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({message:"User not Found"})
        }

        if(user.isDeleted==true){
            res.status(400).json({message:"Your Account is Suspended"})
        }

        const product = await Product.findById(productId)
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }

        let wishListItem = await wishList.findOne({userId:user._id, productId:product._id})
        if(wishListItem){
            res.status(400).json({message:"Product Already added in the Wishlist"});
        }else{
            wishListItem =await wishList.create({
                userId:user._id,
                productId:product._id,
                quantity:1
            });
            user.wishList.push(wishListItem._id);
            await user.save();
            res.status(200).json({message:"Product Added to Wishlist Successfully"})
        }
    }catch(error){
        return next(error)
    }
};




export const viewWishList = async (req,res,next)=>{
    try{
        const userid =req.params.userid
        if(!userid){
            res.status(404).json({message:"not Getting User Id"})
        }
        const user = await User.findById(userid).populate({
            path:"wishList",
            populate:{path:'productId'}
        });
        if(!user){
            res.status(404).json({message:"User not Found"})
        }
        if(!user|| user.wishList.length==0){
            res.status(200).json({message:"WishList is Empty"})
        }
        res.status(200).json(user.wishList)
    }catch(error){
        return next(error)
    }
}



export const removeWishList= async(req,res,next)=>{
    try{
        const userid=req.params.userid
        const productid=req.params.productid

        const user = await User.findById(userid)
        if(!user){
            res.status(404).json({message:"User not Found"})
        }
        if(user.isDeleted==true){
            res.status(400).json({message:"Your Account is Suspended"})
        }
        const product = await Product.findById(productid)
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }
        const updateWishList= await wishList.findOneAndDelete({userId:user._id,productId:product._id})
        if(!updateWishList){
            res.status(404).json({message:"Product not Found in the Wishlist"})
        }
        const wishLishItemIndex= await user.wishList.findIndex(item=>item.equals(updateWishList._id))
        if(wishLishItemIndex !==-1){
            user.wishList.splice(wishLishItemIndex,1)
            await user.save()
        }
        res.status(200).json({message:"Product Removed Successfully"})
    }catch(error){
        return next(error);
    }
};