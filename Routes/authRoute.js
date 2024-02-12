const express= require('express');
const { createUser, loginUserCtrl, getUser, delUser, updateUser, getaUser, blockUser, unBlockUser, handlerRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdminCtrl, saveAddress, userCart, emptyCart, applyCoupon, createOrder, getOrders, UpdateOrderStatus } = require('../Controllers/userController');
const router= express.Router();
const {authMiddlewere, isAdmin} = require('../middlewares/authMiddlewere');
const { getWishList } = require('../Controllers/productController');
const { uploadPhoto, ImgProdResize } = require("../middlewares/uploadImages");

//routes user
//post-Routes
router.post('/register', createUser);
router.post('/login', loginUserCtrl );
router.post('/admin', loginAdminCtrl);
router.post('/cart', userCart);
router.post('/cart/applycoupon', applyCoupon);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/cart/cash-order',authMiddlewere ,createOrder);

//Put-Routes
router.put('/address', authMiddlewere, saveAddress);
router.put('/update-user', authMiddlewere, updateUser);
router.put('/blocked-user/:id', authMiddlewere, isAdmin, blockUser);
router.put('/unblocked-user/:id', authMiddlewere, isAdmin, unBlockUser);
router.put('/unblocked-user/:id', authMiddlewere, isAdmin, unBlockUser);
router.put('refresh', handlerRefreshToken);
router.put('logout', logout);
router.put('/reset-password/:token', resetPassword);
router.put('/password',authMiddlewere ,updatePassword);
router.put('/order/update_order/:id', authMiddlewere, isAdmin, UpdateOrderStatus);

//Get-routes
router.get('/all-users', getaUser);
router.get('/:id',authMiddlewere, isAdmin, getUser);
router.get('/wishlist', authMiddlewere, getWishList);
router.get('/cart', authMiddlewere, userCart);
router.get('/order', authMiddlewere, getOrders);

//Deletes-routes
router.delete('/delete/:id', delUser);
router.delete('/cart', authMiddlewere, emptyCart);


module.exports= router;