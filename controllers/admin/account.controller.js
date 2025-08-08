const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

//[GET] admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    delete: false,
  };
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      delete: false,
      _id: record.role_id,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Trang accounts",
    records: records,
  });
};

//[GET] admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    delete: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Trang tạo account",
    roles: roles,
  });
};

//[POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    delete: false,
  });
  console.log(emailExist);

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect(req.get("referer"));
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    record.save();
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
