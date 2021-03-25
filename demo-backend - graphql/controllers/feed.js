const Post = require("../models/Post");
const { validationResult } = require('express-validator/check');
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page;
    const perPage = 2;
    let totalItems = 0;
    try {
        const { count, rows: posts } = await Post.findAndCountAll({
            offset: (currentPage - 1) * perPage,
            limit: perPage
        })
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
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }

}


exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findByPk(postId)

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
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }

}

exports.createPost = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed while creating post');
        error.statusCode = 422;
        throw error;
    }
    //console.log(req.userId);
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            const error = new Error('User not Found');
            error.statusCode = 404;
            throw error;
        }

        const post = await user.createPost({
            title: title,
            content: content
        })


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
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    };

}




exports.updatePost = async (req, res, next) => {
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
    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            const error = new Error('Post Not Found');
            error.statusCode = 404;
            throw error;
        }

        postFound = post;

        const user = await post.getUser();


        if (user.id !== req.userId) {
            const error = new Error('Not Authorized');
            error.statusCode = 403;
            throw error;
        }

        postFound.title = title;
        postFound.content = content;
        postFound = await postFound.save();


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
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }

}


exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    let postFound;
    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            const error = new Error('Post Not Found');
            error.statusCode = 404;
            throw error;
        }

        postFound = post;
        const user = await post.getUser();

        if (user.id !== req.userId) {
            const error = new Error('Not Authorized');
            error.statusCode = 403;
            throw error;
        }

        postFound = await postFound.destroy();

        return res.status(200).json({ message: "Post Deleted Successfully" });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }

}