const express = require('express');
const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');

const router = express.Router();


router.get('/signup', authController.getSignUp);

router.post('/signup',
    check('email', 'Invalid email')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Password should have atleast length of 6 and a special character')
        .trim()
        .matches('^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$'),
    body('confirmPassword', 'Password should be same as Confirm Password')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error();
            }
            return true;
        }),
    check('email')
        .trim()
        .normalizeEmail()
        .custom(value => {
            console.log(value)
            return User.findOne({ where: { email: value } })
                .then(user => {
                    console.log(user)
                    if (user) {
                        return Promise.reject('Email already exists!');
                    }
                })
        })
    , authController.postSignUp);

router.get('/login', authController.getLogin);

router.post('/login',
    check('email', 'Invalid email')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Password should have atleast length of 6 and a special character')
        .trim()
        .matches('^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$'),
    authController.postLogin);

router.post('/logout', isAuth, authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

module.exports = router;