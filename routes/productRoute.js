import express from 'express';
import { allProductView, categorywise, specificProducts } from '../controller/userProductController.js';
import { userToken } from '../middleware/user_jwt_token.js';
import { addCart, decrement, increment, removeCart, viewCart } from '../controller/cartController.js';
import { addWishList, removeWishList, viewWishList } from '../controller/wishListController.js';
import { payment, verifyPayment } from '../controller/userPaymentController.js';

const router= express.Router();

// router.use(userToken);


router.get('/products',allProductView);
router.get('/product/:id',specificProducts);
router.get('/product/category/:category',categorywise);


router.post('/:userid/cart/:productid',addCart);
router.get('/cart/:userid',viewCart);
router.delete('/:userid/cart/:productid/remove',removeCart);
router.post('/:userid/cart/:productid/increment',increment);
router.post('/:userid/cart/:productid/decrement',decrement);


router.post('/:userid/wishlist/:productid',addWishList);
router.get('/wishlist/:userid',viewWishList);
router.delete('/:userid/wishlist/:productid/remove',removeWishList)

router.post('/:userid/payment',payment)
router.post('/verifypayment',verifyPayment)

export default router; 