import express from 'express';
import { allProductView, categorywise, specificProducts } from '../controller/userProductController.js';
import { userToken } from '../middleware/user_jwt_token.js';

const router= express.Router();

// router.use(userToken);


router.get('/products',allProductView);
router.get('/product/:id',specificProducts);
router.get('/product/category/:category',categorywise);

export default router;