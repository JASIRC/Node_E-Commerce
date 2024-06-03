import Product from "../Schema/productSchema.js"
import productjoi from "../validation/productValidation.js";


export const createProduct= async (req,res,next)=>{
    try{
        const {value,error}= productjoi.validate(req.body)
        console.log(value);
        if(error){
            res.status(404).json({Details:error})
        }

        const newProduct=new Product({
            title:value.title,
            description:value.description,
            price:value.price,
            productImg:req.cloudinaryImageUrl,
            category:value.category
        });
        console.log(value);
        await newProduct.save();
        res.status(201).json({message:"Product Added Successfully"});

    }   catch(error){
        return next(error);
    }
};

export const allProductView = async (req,res,next)=>{
    try{
        const products = await Product.find();

        if(!products){
            res.status(404).json({message:"Product not Found"})
        }
        res.status(200).json({message:"Successfully Fetched Products",data:products})
    }catch(error){
        return next(error)
    }
};

export const specificProduct = async (req,res,next)=>{
    try{
        const id= req.params.id;

        if(!id){
            res.status(404).json({message:"ID not Found"});
        }

        const product=await Product.findById(id);
        if(!product){
            res.status(404).json({message:"Product not Found"})
        }
        res.status(200).json({message:"Successfully Fetched Products",data:product})
    }catch(error){
        return next(error);
    }
};

export const viewCategoryWise = async (req,res,next)=>{
    try{
        const name= req.params.category;    

        const product= await Product.find({
            $or:[
                {title:{$regex: new RegExp(name,"i")}},
                {category:{$regex: new RegExp(name,"i")}}
            ]
        });
        if(product.length==0){
            res.status(404).json({message:"Product not Found"});
        }
        res.status(200).json({message:"Successfullt Fetched Categories", data:product});
    }catch(error){
        return next(error);
    }
};

export const updateProduct = async(req,res,next)=>{
    try{
        const id=req.params.id;
        const product=await Product.findById(id);
        if(!product){
            res.status(404).json({message:"Product not Found"});
        }
        const {title,description,price,category}=req.body;

        if(title){
            product.title=title
        };
        if(description){
            product.description=description
        };
        if(price){
            product.price=price
        };
        if (req.cloudinaryImageUrl) {
            product.productImg = req.cloudinaryImageUrl
        };
        if(category){
            product.category=category
        };

        await product.save()
        res.status(200).json({message:"Updated Successfully"})
    }catch(error){
        return next(error);
    }
};

export const deleteProduct= async(req,res,next)=>{
    try{
        const id=req.params.id
        await Product.findByIdAndDelete(id);
        res.status(200).json({message:"Successfully Deleted Product"});
    }catch(error){
        return next(error);
    }
};


