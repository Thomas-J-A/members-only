exports.index_get = (req, res) => {
  res.render('index', { user: req.user });
};
