const Post = require('../models/post');

exports.index_get = (req, res) => {
  // Retrieve all posts from database
  Post
    .find()
    .sort({ timestamp: -1 })
    .populate('user')
    .exec((err, posts) => {
      if (err) { return next(err); }
      res.render('index', { posts });
    })
};
