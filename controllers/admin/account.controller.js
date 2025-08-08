const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

//[GET] admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    delete: false,
  };
  const records = await Account.find(find);
  res.render("admin/pages/accounts/index", {
    pageTitle: "Trang accounts",
    records: records,
  });
};

//[GET] admin/accounts/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/accounts/create", {
    pageTitle: "Trang accounts",
  });
};

//[POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
  const record = new Account(req.body);
  record.save();
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
