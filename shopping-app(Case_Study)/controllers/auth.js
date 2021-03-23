const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const { Op } = require('sequelize')
const { validationResult } = require('express-validator/check')
const User = require("../models/user");


exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput:{
      email:'',
      password:''
    },
    validationErrors:[]
  });
};

exports.postLogin = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array()[0].msg;
    return res.status(422).render('auth/login',
      {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput:{
          email:email,
          password:password
        },
        validationErrors:[errors.array()[0]]
      });
  }
  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        console.log("email failed");
        return res.status(422).render('auth/login',
        {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email',
          oldInput:{
            email:email,
            password:password
          },
          validationErrors:[{param:'email'}]
        });
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            console.log("password failed");
            return res.status(422).render('auth/login',
            {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: 'Invalid Password',
              oldInput:{
                email:email,
                password:password
              },
              validationErrors:[{param:'password'}]
            });
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            console.log(err);
            res.redirect("/");
          })
        })
      console.log("hello")
    }).catch(err => console.log(err))

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });

};

exports.getSignUp = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/signup',
    {
      path: '/signup',
      pageTitle: 'Sign Up',
      errorMessage: message,
      oldInput:{
        email:'',
        password:'',
        confirmPassword:''
      },
      validationErrors:[]
    });
}

exports.postSignUp = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array()[0].msg;
    return res.status(422).render('auth/signup',
      {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: message,
        oldInput:{
          email:email,
          password:password,
          confirmPassword:confirmPassword
        },
        validationErrors:[errors.array()[0]]
      });
  }

  bcrypt.hash(password, 12)
    .then(password => {
      return User.create({
        email: email,
        password: password
      })
    })
    .then(user => {
      return user.createCart();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err))

}


exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  let token;
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        req.flash('error', 'User with this email doesnot exist!');
        return req.session.save(err => {
          if (!err)
            res.redirect('/reset');
        });
      }
      crypto.randomBytes(32, (err, buffer) => {
        if (err) { return res.redirect('/login') }
        token = buffer.toString('hex');
        user.token = token;
        user.tokenExpiryDate = Date.now() + 3600000;
        user.save()
          .then(user => {
            res.redirect('/reset-password?token=' + token);
          })
      })
    }).catch(err => console.log(err))

}

exports.getResetPassword = (req, res, next) => {
  const token = req.query.token;
  //console.log("token",token);
  User.findAll({ where: { token: token, tokenExpiryDate: { [Op.gt]: Date.now() } } })
    .then(users => {
      //  console.log(users);
      if (users.length === 0) {
        return res.redirect('/login')
      }

      res.render('auth/new-password', {
        path: '/reset-password',
        pageTitle: 'New Password',
        userId: users[0].id,
        token: token
      });
    })
    .catch(err => console.log(err))

}

exports.postResetPassword = (req, res, next) => {
  const newpassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;
  User.findAll({ where: { id: userId, token: token, tokenExpiryDate: { [Op.gt]: Date.now() } } })
    .then(users => {
      if (users.length === 0) {
        return res.redirect('/login')
      }
      const user = users[0];
      bcrypt.hash(newpassword, 12)
        .then(newpassword => {
          user.password = newpassword;
          return user.save()
        }).then(user => {
          res.redirect('/login');
        }).catch(err => console.log(err));
    }).catch(err => console.log(err))

}