const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed while creating user');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            return User.create({
                name: name,
                email: email,
                password: hashedPassword
            })
        })
        .then(user => {
            return res.status(201).json({
                message: 'User created successfully',
                userId: user.id
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
}

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed while logging user in');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    //    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    let userFound;
    try {
        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            const error = new Error('Email not Found');
            error.statusCode = 404;
            throw error;
        }
        userFound = user;
        const isEqual = bcrypt.compare(password, userFound.password)


        if (!isEqual) {
            const error = new Error('Incorrect password');
            error.statusCode = 404;
            throw error;
        }

        const token = jwt.sign({
            email: userFound.email,
            userId: userFound.id
        }, 'secretkey', { expiresIn: '1h' });

        return res.status(200).json({
            message: 'User logged in successfully',
            token: token,
            userId: userFound.id
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);

        return err;
    }

}

exports.getStatus = (req, res, next) => {

    User.findByPk(req.userId)
        .then(user => {
            return res.status(200).json({
                message: 'Status fetched successfully',
                status: user.status
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
}

exports.updateStatus = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed while updating status');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const status = req.body.status;
    User.findByPk(req.userId)
        .then(user => {
            user.status = status;
            return user.save();
        }).then(user => {
            return res.status(201).json({
                message: 'Status updated successfully',
                status: user.status
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        })
}