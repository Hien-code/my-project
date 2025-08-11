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

//[PATCH] admin/accounts/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  // res.redirect("/admin/products");
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const roles = await Role.find({
      delete: false,
    });
    const record = await Account.findOne({ _id: id });
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Trang edit account",
      roles: roles,
      record: record,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại account!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

//[PATCH] admin/accounts/edit
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    delete: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật tài khoản thành công!");
  }
  res.redirect(req.get("referer"));
};

//[DELETE] admin/account/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne(
    { _id: id },
    {
      delete: true,
      deleteAt: new Date(),
    }
  );
  req.flash("success", `Đã xóa sản phẩm thành công!`);

  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[GET] admin/products/trash
module.exports.trash = async (req, res) => {
  const find = {
    delete: true,
  };
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      delete: false,
      _id: record.role_id,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/trash", {
    pageTitle: "Trang trash accounts",
    records: records,
  });
};

// [PATCH] admin/products/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne({ _id: id }, { delete: false, deleteAt: new Date() });
  req.flash("success", "Khôi phục account thành công!");
  res.redirect(req.get("referer"));
};

// [DELETE] admin/products/delete-hard/:id
module.exports.hardDelete = async (req, res) => {
  const id = req.params.id;
  await Account.deleteOne({ _id: id });
  req.flash("success", "Đã xóa vĩnh viễn account!");
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};
