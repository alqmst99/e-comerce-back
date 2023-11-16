const express= require('express');
const { createUser, loginUserCtrl, getUser, delUser, updateUser } = require('../Controllers/userController');
const router= express.Router();

//routes user
router.post('/register', createUser);
router.post('/login', loginUserCtrl );
router.get('/all-users, getaUser');
router.get('/:id', getUser);
router.delete('/delete/:id', delUser);
router.put('/updae/:id', updateUser);

module.exports= router;