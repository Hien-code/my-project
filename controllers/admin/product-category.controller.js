const ProductCategogy = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const createTreeHelper = require("../../helpers/createTree");

//[GET] admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  const find = {
    delete: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  const records = await ProductCategogy.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
  });
};

// [GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      delete: false,
      _id: id,
    };
    const records = await ProductCategogy.findOne(find);

    res.render("admin/pages/products-category/detail", {
      pageTitle: records.title,
      records: records,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] admin/products-catelogy/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  if (req.file && req.file.path) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await ProductCategogy.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      delete: false,
      _id: id,
    };
    const records = await ProductCategogy.findOne(find);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Trang chỉnh sửa sản phẩm",
      records: records,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

//[PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategogy.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  // res.redirect("/admin/products");
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id });
  await ProductCategogy.updateOne(
    { _id: id },
    {
      delete: true,
      deleteAt: new Date(),
    }
  );
  req.flash("success", `Đã xóa sản phẩm thành công!`);

  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[GET] admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    delete: false,
  };

  const records = await ProductCategogy.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Trang tạo Danh mục sản phẩm",
    records: newRecords,
  });
};

//[POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategogy.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategogy(req.body);

  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

//[PATCH] admin/products/change-multi"
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductCategogy.updateMany(
        { _id: { $in: ids } },
        { status: "active" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      );
      break;

    case "inactive":
      await ProductCategogy.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      );
      break;

    case "delete-all":
      await ProductCategogy.updateMany(
        { _id: { $in: ids } },
        {
          delete: true,
          deleteAt: new Date(),
        }
      );
      req.flash("success", `Đã xóa ${ids.length} sản phẩm thành công!`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategogy.updateOne({ _id: id }, { position: position });
      }
      req.flash(
        "success",
        `Đã đổi vị trí của ${ids.length} sản phẩm thành công!`
      );
      break;

    default:
      break;
  }
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[GET] admin/products/trash
module.exports.trash = async (req, res) => {
  const records = await ProductCategogy.find({ delete: true });
  // const countProducts = await Product.countDocuments({ delete: true });
  res.render("admin/pages/products-category/trash", {
    pageTitle: "Trang product category",
    records: records,
  });
};

// [PATCH] admin/products/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;
  await ProductCategogy.updateOne(
    { _id: id },
    { delete: false, deleteAt: new Date() }
  );
  req.flash("success", "Khôi phục sản phẩm thành công!");
  res.redirect(req.get("referer"));
};

// [DELETE] admin/products/delete-hard/:id
module.exports.hardDelete = async (req, res) => {
  const id = req.params.id;
  await ProductCategogy.deleteOne({ _id: id });
  req.flash("success", "Đã xóa vĩnh viễn sản phẩm!");
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};
