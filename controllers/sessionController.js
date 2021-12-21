const passport = require("passport");
const { body, validationResult } = require('express-validator');

exports.login_get = (req, res) => {
  res.render('login');
};

exports.login_post = [
  body('username', 'A username is required').trim().isLength({ min: 1 }).escape(),
  body('password', 'A password is required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const userInput = {
        username: req.body.username,
        password: req.body.password,
      };

      return res.render('login', { userInput, errors: errors.array() });
    }

    next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
];

exports.logout_get = (req, res, next) => {
  req.logout();
  res.redirect('/login');
};
