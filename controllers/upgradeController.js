const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.member_register_get = (req, res) => {
  res.render('member-register');
};

exports.member_register_post = [
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A password is required')
    .bail()
    .custom((value) => {
      return value === process.env.MEMBER_PASSWORD;
    })
    .withMessage('Incorrect password')
    .escape(),

  // Process validated and sanitized input
  (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      // There are errors - re-render form with sanitized values/error messages
      return res.render('member-register', { password: req.body.password, errors: errors.array() });
    }

    // User typed in correct password - upgrade membership
    const id = res.locals.currentUser._id
    User.findByIdAndUpdate(id, { isMember: true }, (err, user) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  },
];

exports.admin_register_get = (req, res) => {
  res.render('admin-register');
};

exports.admin_register_post = [
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A password is required')
    .bail()
    .custom((value) => {
      return value === process.env.ADMIN_PASSWORD;
    })
    .withMessage('Incorrect password')
    .escape(),

  // Process validated and sanitized input
  (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      // There are errors - re-render form with sanitized values/error messages
      return res.render('admin-register', { password: req.body.password, errors: errors.array() });
    }

    // User typed in correct password - upgrade to admin
    // Admins also become members if not already
    const id = res.locals.currentUser._id;
    const updateFields = {
      isMember: true,
      isAdmin: true,
    };

    User.findByIdAndUpdate(id, updateFields, (err) => {
      if (err) { return next(err); }
      res.redirect('/');
    })
  },
];
