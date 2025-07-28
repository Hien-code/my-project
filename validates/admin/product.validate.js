module.exports.createPost = async (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề");
    res.redirect(req.get("referer"));
    return;
  }
  next();
};
