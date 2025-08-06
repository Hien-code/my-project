const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

//[GET] admin/roles
module.exports.index = async (req, res) => {
  let find = {
    delete: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: "Trang nhóm quyền",
    records: records,
  });
};

//[GET] admin/roles/create
module.exports.create = async (req, res) => {
  let find = {
    delete: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/create", {
    pageTitle: "Trang tạo nhóm quyền",
    records: records,
  });
};

//[GET] admin/roles/create
module.exports.createPost = async (req, res) => {
  let find = {
    delete: false,
  };

  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
