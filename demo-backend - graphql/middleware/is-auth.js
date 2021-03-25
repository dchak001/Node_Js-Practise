const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        req.errorCode = 401;
       return next();
    }
    

    jwt.verify(authHeader.split(" ")[1], 'secretkey', (err, authData) => {
        if (err) {
            req.isAuth = false;
            req.errorCode = 403;
           return next();
        }
        req.userId = authData.userId;
        req.isAuth=true;
       return next();
    });

}