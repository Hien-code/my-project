const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

//[GET] admin/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Trang admin",
  });
};

//[POST] admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Account.findOne({ delete: false, email: email });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("referer"));
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Nhập sai mật khẩu!");
    res.redirect(req.get("referer"));
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect(req.get("referer"));
    return;
  }

  console.log(user);
  res.cookie("token", user.token);

  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};
