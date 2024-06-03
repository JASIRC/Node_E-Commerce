import express from 'express';
import uploadImage from '../middleware/image_uploader.js';
import { allProductView, createProduct, deleteProduct, specificProduct, updateProduct, viewCategoryWise} from '../controller/adminProductController.js';

const router=express.Router()

router.post('/addProducts',uploadImage,createProduct);
router.get('/viewProducts',allProductView);
router.get('/viewProduct/:id',specificProduct);
router.get('/viewProducts/:category',viewCategoryWise);
router.patch('/updateProduct/:id',updateProduct);
router.delete('/deleteProduct/:id',deleteProduct);

export default router