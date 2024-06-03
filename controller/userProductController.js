import Product from "../Schema/productSchema.js";


export const allProductView= async (req,res,next)=>{
    try{
        const products = await Product.find();

        if(!products){
            res.status(404).json({message:"Product not Found"});
        }
        res.status(200).json({message:"Successfully Fetched Product",data:products})
    }catch(error){
        return next(error)
    }
};

export const specificProducts=async (req,res,next)=>{
    try{
        const id=req.params.id; 

        if(!id){
            res.status(404).json({message:"ID not Found"});
        }

        const product=await Product.findById(id);
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }
        res.status(200).json({message:"Successfully Fetched Product", data:product});
    }catch(error){
        return next(error);
    }
};

export const categorywise=async (req,res,next)=>{
    try{
        const name=req.params.category;

        if(!name){
            res.status(404).json({message:"Category not Found"});
        }

        const categories= await Product.find({
            $or:[
                {title:{$regex:new RegExp(name,"i")}},
                {category:{$regex:new RegExp(name,"i")}}
            ]
        });
        
        if(categories.length==0){
            res.status(404).json({message:"Product not Found"});
        }
        res.status(200).json({message:"Successfully Fetched Categories", data:categories})
    }catch(error){
        return next(error);
    }
};