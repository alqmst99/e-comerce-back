const express= require('express');
const { createUser, loginUserCtrl, getUser, delUser, updateUser, getaUser, blockUser, unBlockUser, handlerRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../Controllers/userController');
const router= express.Router();
const {authMiddlewere, isAdmin} = require('../middlewares/authMiddlewere')

//routes user
router.post('/register', createUser);
router.post('/login', loginUserCtrl );
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password',authMiddlewere ,updatePassword)
router.get('/all-users', getaUser);
router.get('/:id',authMiddlewere, isAdmin, getUser);
router.delete('/delete/:id', delUser);
router.put('/update-user', authMiddlewere, updateUser);
router.put('/blocked-user/:id', authMiddlewere, isAdmin, blockUser);
router.put('/unblocked-user/:id', authMiddlewere, isAdmin, unBlockUser);
router.put('/unblocked-user/:id', authMiddlewere, isAdmin, unBlockUser);
router.put('refresh', handlerRefreshToken);
router.put('logout', logout);

module.exports= router;