const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

// Configure multer middleware for file uploads
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

exports.register_get = (req, res) => {
  res.render('register');
};

exports.register_post = [
  // Upload avatar
  // req.body/req.file are populated here
  upload.single('avatar'),

  // Validate and sanitize input
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A username is required')
    .bail()

    // Check if username already in use
    .custom((value) => {
      return new Promise((resolve, reject) => {
        User.findOne({ username: value }, (err, user) => {
          if (user === null) resolve();
          else reject();
        });
      });
    })
    .withMessage('Username already taken')
    .escape(),
  body('password', 'A password is required').trim().isLength({ min: 1 }).escape(),
  body('confirm_password', 'Password fields must match')
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape()
    .custom((value, { req }) => {
      // Hack to validate *file* upload using express-validator
      return (req.file) ? true : false;
    })
    .withMessage('A profile picture is required'),

  (req, res, next) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      // There are validation errors
      // Input data used to populate re-rendered form
      const userInput = {
        username: req.body.username,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
      };

      // If file sent, remove from storage since new data will be sent over
      // and it will be duplicated
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) { return next(err); }
        });
      }
      
      // Re-render form with santitized values/error messages
      return res.render('register', { userInput, errors: errors.array() });
    }

    // Data validated and sanitized - continue processing request
    next();
  },

  // hash password
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) { return next(err); }

      const user = new User({
        username: req.body.username,
        password: hash,
        avatarURL: req.file.path,
        isMember: false,
        isAdmin: false,
      });

      user.save((err) => {
        if (err) { return next(err); }

        res.redirect('/login');
      });
    });
  },
];
