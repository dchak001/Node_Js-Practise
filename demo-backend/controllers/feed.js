const Post = require("../models/Post");
const { validationResult } = require('express-validator/check');
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page;
    const perPage = 2;
    let totalItems = 0;
    Post.findAndCountAll({
        offset: (currentPage - 1) * perPage,
        limit: perPage
    })
        .then(({ count, rows: posts }) => {
            totalItems = count;
            let postsInfo = posts.map(post => {
                return {
                    _id: post.id,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    creator: { name: 'Dipan' }
                }

            });

            return res.status(200).json({ message: "Posts Fetched Successfully", posts: postsInfo, totalItems: totalItems });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })

}


exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findByPk(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post Not Found');
                error.statusCode = 404;
                throw error;
            }


            return res.status(200).json({
                message: "Post Fetched Successfully",
                post: {
                    _id: post.id,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    creator: { name: 'Dipan' }
                }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })

}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed while creating post');
        error.statusCode = 422;
        throw error;
    }
    console.log(req.userId);
    User.findByPk(req.userId).
        then(user => {
            if (!user) {
                const error = new Error('User not Found');
                error.statusCode = 404;
                throw error;
            }

            return user.createPost({
                title: title,
                content: content
            })

        }).then(post => {
            console.log("created");
            return res.status(201).json({
                message: 'Post created successfully',
                post: {
                    _id: post.id,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    creator: { name: 'Dipan' }
                }
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });

}




exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let postFound;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed while creating post');
        error.statusCode = 422;
        throw error;
    }
    Post.findByPk(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post Not Found');
                error.statusCode = 404;
                throw error;
            }
            
            postFound=post;
            
           return post.getUser();
           
        })
        .then(user=>{
            if(user.id!==req.userId)
            {
                const error = new Error('Not Authorized');
                error.statusCode = 403;
                throw error;
            }

            postFound.title = title;
            postFound.content = content;
            return postFound.save();

        })
        .then(post => {
            return res.status(200).json({
                message: 'Post updated successfully',
                post: {
                    _id: post.id,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    creator: { name: 'Dipan' }
                }
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })

}


exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    let postFound;
    Post.findByPk(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post Not Found');
                error.statusCode = 404;
                throw error;
            }

            postFound=post;
           return post.getUser();
        })
        .then(user=>{
            if(user.id!==req.userId)
            {
                const error = new Error('Not Authorized');
                error.statusCode = 403;
                throw error;
            }

            return postFound.destroy();
        }).then(post => {
            return res.status(200).json({ message: "Post Deleted Successfully" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })

}