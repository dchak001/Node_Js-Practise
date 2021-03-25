const express=require('express');
const {body}=require('express-validator/check')

const router=express.Router();

const feedController=require('../controllers/feed');
const { isAuth } = require('../middleware/is-auth');

router.get('/posts',isAuth,feedController.getPosts);

router.get('/posts/:postId',isAuth,feedController.getPost);

router.post('/add-post',[
    body('title')
    .trim()
    .isLength({min:5}),
    body('content')
    .trim()
    .isLength({min:5})
],isAuth,feedController.createPost);

router.put('/update-post/:postId',[
    body('title')
    .trim()
    .isLength({min:5}),
    body('content')
    .trim()
    .isLength({min:5})
],isAuth,feedController.updatePost);

router.delete('/delete-post/:postId',isAuth,feedController.deletePost)
module.exports=router;