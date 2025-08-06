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

//[PORT] admin/roles/create
module.exports.createPost = async (req, res) => {
  let find = {
    delete: false,
  };

  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

//[GET] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      _id: id,
      delete: false,
    };
    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Trang chỉnh sửa nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

//[PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật nhóm quyền thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật nhóm quyền thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

//[GET] admin/roles/trash
module.exports.trash = async (req, res) => {
  const records = await Role.find({ delete: true });
  res.render("admin/pages/roles/trash", {
    pageTitle: "Trang thùng rác",
    records: records,
  });
};

//[DELETE] admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne(
    { _id: id },
    {
      delete: true,
      deleteAt: new Date(),
    }
  );
  req.flash("success", `Đã xóa nhóm quyền thành công!`);

  res.redirect(req.get("referer"));
};

//[DELETE] admin/roles/delete-hard/:id
module.exports.deleteHard = async (req, res) => {
  const id = req.params.id;
  await Role.deleteOne({ _id: id });
  req.flash("success", `Đã xóa vĩnh viễn nhóm quyền!`);
  res.redirect(req.get("referer"));
};

// [PATCH] admin/roles/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne({ _id: id }, { delete: false, deleteAt: new Date() });
  req.flash("success", "Khôi phục nhóm quyền thành công!");
  res.redirect(req.get("referer"));
};
