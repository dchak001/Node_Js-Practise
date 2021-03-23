const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    let decoded;
    try {
         decoded = jwt.verify(authHeader.split(" ")[1], 'secretkey');
    }
    catch (err) {
        err.statusCode = 500;
        throw err;

    }

    if (!decoded) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }

    req.userId=decoded.userId;
    next();
}