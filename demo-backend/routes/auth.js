const express=require('express');
const {body}=require('express-validator/check')

const authController=require('../controllers/auth');
const { isAuth } = require('../middleware/is-auth');
const User = require('../models/user');

const router=express.Router();

router.post('/signUp',[
    body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid Email')
    .normalizeEmail()
    .custom(value=>{
        return User.findAll({where:{email:value}})
        .then(users=>{
            if(users.length>0)
            {
                return Promise.reject('Email already exits!');
            }
        })
    }),
    body('password',"Password must be of length more than 5")
    .trim()
    .isLength({min:5}),
    body('name')
    .trim()
    .not()
    .isEmpty()
],authController.signUp);

router.post('/login',[
    body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid Email')
    .normalizeEmail(),
    body('password',"Password must be of length more than 5")
    .trim()
    .isLength({min:5})
],authController.login);

router.get('/status',isAuth,authController.getStatus)

router.put('/status',[
    body('status','Status cant be empty')
    .trim()
    .not()
    .isEmpty()
],isAuth,authController.updateStatus)

module.exports=router;
