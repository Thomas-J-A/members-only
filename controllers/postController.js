const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

exports.post_message_get = (req, res) => {
  res.render('post-message');
};

exports.post_message_post = [
  body('title', 'A title is required').trim().isLength({ min: 1 }).escape(),
  body('content', 'A message is required').trim().isLength({ min: 1 }).escape(),
  
  // Process validated and sanitized input
  (req, res, next) => {
    const errors = validationResult(req);

    // Create post object with escaped and trimmed data
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
      user: req.user._id,
    });

    // Check for validation errors
    if (!errors.isEmpty()) {
      // There are errors - re-render with sanitized values/error messages
      return res.render('post-message', { post, errors: errors.array() });
    }

    // Post data is valid - save to db and redirect to homepage
    post.save((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  },
];

exports.delete_message_post = (req, res, next) => {
  const postId = req.body['delete-message'];
  Post.findByIdAndRemove(postId, (err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
};
