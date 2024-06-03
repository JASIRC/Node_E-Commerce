import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import productRouter from './routes/productRoute.js'

const Port=process.env.Port || 5000
dotenv.config()

const app=express()
app.use(express.json());

app.use("/user/api",userRouter);
app.use("/user/api",productRouter);

app.use("/admin/api",adminRouter);



mongoose.connect(process.env.db)
.then(()=>console.log("DataBase Connected"))
.catch((err)=>console.error("DataBase Error",err))


app.listen(Port,()=>console.log(`Server Running on http://localhost:${Port}`))