const User = require("../models/user");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const Post = require("../models/Post");


module.exports = {

    signUp: async ({ userInput }, req) => {

        const email = userInput.email;
        const password = userInput.password;
        const name = userInput.name;
        const errors = [];
        if (!validator.isEmail(email)) {
            errors.push({ message: "Invalid Email Format" });
        }
        if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
            errors.push({ message: "Password should have atleast length 5" });
        }

        if (validator.isEmpty(name)) {
            errors.push({ message: "Name cannot be empty" });
        }


        try {
            const emailExists = await User.findOne({ where: { email: email } });
            if (emailExists) {
                errors.push({ message: "Email already exits" });
            }
            if (errors.length > 0) {
                const error = new Error('Validation failed');
                error.data = errors;
                error.code = 422;
                throw error;
            }

            // const finalEmail=validator.normalize(email);
            const hashedPassword = await bcrypt.hash(password, 12);
            const createdUser = User.create({
                email: email,
                password: hashedPassword,
                name: name
            });

            return createdUser;
        }
        catch (err) {
            throw err;
        }

    },
    login: async ({email,password})=>{

        const errors = [];

        if (!validator.isEmail(email)) {
            errors.push({ message: "Invalid Email Format" });
        }

        if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
            errors.push({ message: "Password should have atleast length 5" });
        }
        if (errors.length > 0) {
            const error = new Error('Validation failed');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        try{
        const user=await User.findOne({where:{email:email}});
        if(!user)
        {
            const error = new Error('Incorrect Email');
                error.code = 401;
                throw error;
        }
        const isEqual=await bcrypt.compare(password,user.password);
        if(!isEqual)
        {
            const error = new Error('Incorrect Password');
            error.code = 401;
            throw error;
        }

        const token=jwt.sign({userId:user.id,email:user.email},'secretkey',{expiresIn:'1h'});

        return {
            userId:user.id,
            token:token
        }
    }
    catch(err){
        throw err
    }
    },
    getUser: async (_,req) => {
        if(!req.isAuth)
        {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }

        const user = await User.findByPk(req.userId);
            if(!user)
            {
            const error = new Error('User Not Found');
            error.code = 404;
            throw error;
            }
        return user;
    },
    updateStatus:async ({status},req)=>{
        if(!req.isAuth)
        {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        const errors=[];
        if (validator.isEmpty(status)) {
            errors.push({ message: "Status cannot be empty" });
        }
        if (errors.length > 0) {
            const error = new Error('Validation failed');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findByPk(req.userId);
            if(!user)
            {
            const error = new Error('User Not Found');
            error.code = 404;
            throw error;
            }

            user.status=status;
            const updatedUser=await user.save();

            return updatedUser;
    },
    addPost: async ({ postInput }, req) => {
        if(!req.isAuth)
        {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }

        const title = postInput.title;
        const content = postInput.content;

        const errors = [];

        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            errors.push({ message: "Title should have atleast length 5" });
        }

        if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
            errors.push({ message: "Content should have atleast length 5" });
        }

        if (errors.length > 0) {
            const error = new Error('Validation failed');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        try {

            const user = await User.findByPk(req.userId);
            if(!user)
            {
            const error = new Error('User Not Found');
            error.code = 404;
            throw error;
            }
            const post = await user.createPost({
                title: title,
                content: content
            });

            return {
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt.toISOString(),
                creator: await post.getUser(),
            };
        }
        catch (err) {
            throw err;
        }


    },
    updatePost: async ({ id,postInput }, req) => {
        if(!req.isAuth)
        {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }

        const title = postInput.title;
        const content = postInput.content;

        const errors = [];

        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            errors.push({ message: "Title should have atleast length 5" });
        }

        if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
            errors.push({ message: "Content should have atleast length 5" });
        }

        if (errors.length > 0) {
            const error = new Error('Validation failed');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        try {

            const user = await User.findByPk(req.userId);
            if(!user)
            {
            const error = new Error('User Not Found');
            error.code = 404;
            throw error;
            }
            const post = await Post.findByPk(id);
            if (!post) {
                const error = new Error('Post not found');
                error.code = 404;
                throw error;
            }

            const creator=await post.getUser();
            if(user.id!==creator.id)
            {
                const error = new Error('Forbidden');
                error.code = 403;
                throw error;
            }
            post.title=title;
            post.content=content;

            await post.save();

            return {
                id: post.id,
                title: title,
                content: content,
                createdAt: post.createdAt.toISOString(),
                creator: await post.getUser(),
            };
        }
        catch (err) {
            throw err;
        }


    },
    deletePost: async ({ id },req) => {
        if(!req.isAuth)
        {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        try {

            const user = await User.findByPk(req.userId);
            if(!user)
            {
            const error = new Error('User Not Found');
            error.code = 404;
            throw error;
            }
            const post = await Post.findByPk(id);
            if (!post) {
                const error = new Error('Post not found');
                error.code = 404;
                throw error;
            }

            const creator=await post.getUser();
            if(user.id!==creator.id)
            {
                const error = new Error('Forbidden');
                error.code = 403;
                throw error;
            }
           
            await post.destroy();
            return true;

        } catch (err) {
            throw err;
        }
    },

    getPost: async ({ id },req) => {
        if(!req.isAuth)
        {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        try {
            const post = await Post.findByPk(id);
            if (!post) {
                const error = new Error('Post not found');
                error.code = 404;
                throw error;
            }
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt.toISOString(),
                creator: await post.getUser(),
            };

        } catch (err) {
            throw err;
        }
    },
    getPosts: async ({page},req) => {
       // console.log(req);
        if(!req.isAuth)
        {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }
        try {
            const perPage=2;
            const {count:totalItems,rows} = await Post.findAndCountAll(
                {
                    offset:(page-1)*perPage,
                    limit:perPage,
                    order:[
                        ['createdAt','DESC']
                    ]
                }
            );
            const posts=rows.map(async post => {
                return {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt.toISOString(),
                    creator: await post.getUser()
                }
            })

            return {
                posts:posts,
                totalItems:totalItems
            }
        }
        catch (err) {
            throw err;
        }
    }
}