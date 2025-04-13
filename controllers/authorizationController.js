const auth = {
  required: function (req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect("/login");
  },

  optional: function (req, res, next) {
    return next();
  },
};
