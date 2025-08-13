const Product = require("../../models/product.model");
const ProductCategogy = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const createTreeHelper = require("../../helpers/createTree");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

//[GET] admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    delete: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts
  );
  //end pagination

  //sort
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //End sort

  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)
    .sort(sort);

  for (const product of products) {
    // Lấy thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }

    // Lấy thông tin người cập nhật
    // const updatedBy = product.updatedBy.slice(-1)[0]
    const updatedBy = product.updatedBy[product.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({ _id: updatedBy.account_id });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

  res.render("admin/pages/products/index", {
    pageTitle: "Trang product",
    product: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("success", "Cập nhật trạng thái thành công!");

  // res.redirect("/admin/products");
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

//[PATCH] admin/products/change-multi"
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      );
      break;

    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`
      );
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          delete: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Đã xóa ${ids.length} sản phẩm thành công!`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
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

//[GET] admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    delete: false,
  };

  const category = await ProductCategogy.find(find);

  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create", {
    pageTitle: "Trang thêm mới sản phẩm",
    category: newCategory,
  });
};

//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Thêm field account_id cho Product = id của người tạo user.id
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };

  //Tạo mới 1 product
  const product = new Product(req.body);

  //Lưu lại trong database
  await product.save();

  res.redirect(req.get("referer"));
};

//[GET] admin/products/trash
module.exports.trash = async (req, res) => {
  const products = await Product.find({ delete: true });
  res.render("admin/pages/products/trash", {
    pageTitle: "Trang product",
    product: products,
  });
};

// [PATCH] admin/products/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { delete: false, deleteAt: new Date() });
  req.flash("success", "Khôi phục sản phẩm thành công!");
  res.redirect(req.get("referer"));
};

//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    {
      delete: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Đã xóa sản phẩm thành công!`);

  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

// [DELETE] admin/products/delete-hard/:id
module.exports.hardDelete = async (req, res) => {
  const id = req.params.id;
  await Product.deleteOne({ _id: id });
  req.flash("success", "Đã xóa vĩnh viễn sản phẩm!");
  res.redirect(req.get("referer")); // Giữ nguyên URL gốc
};

// [GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      delete: false,
      _id: id,
    };
    const product = await Product.findOne(find);

    const category = await ProductCategogy.find({
      delete: false,
    });

    const newCategory = createTreeHelper.tree(category);
    res.render("admin/pages/products/edit", {
      pageTitle: "Trang chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file && req.file.path) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }

  res.redirect(req.get("referer"));
};

// [GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      delete: false,
      _id: id,
    };
    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
