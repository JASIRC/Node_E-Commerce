import express from 'express';
import uploadImage from '../middleware/image_uploader.js';
import { allProductView, createProduct, deleteProduct, specificProduct, updateProduct, viewCategoryWise} from '../controller/adminProductController.js';
import { adminLogin, deleteUser, userBlockandUnblock, viewAllUser, viewSpecificUser, viewUserNameWise } from '../controller/adminUserController.js';

const router=express.Router()


router.post('/login',adminLogin);
router.get('/usersdata',viewAllUser);
router.get('/userdata/:id',viewSpecificUser);
router.get('/username/:name',viewUserNameWise);
router.patch('/user/B&U/:id',userBlockandUnblock);
router.delete('/deleteUser/:id',deleteUser);

router.post('/addProducts',uploadImage,createProduct);
router.get('/viewProducts',allProductView);
router.get('/viewProduct/:id',specificProduct);
router.get('/viewProducts/:category',viewCategoryWise);
router.patch('/updateProduct/:id',updateProduct);
router.delete('/deleteProduct/:id',deleteProduct);

export default router