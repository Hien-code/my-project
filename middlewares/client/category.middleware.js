const ProductCategogy = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategogy.find({
    delete: false,
    status: "active",
  });
  const newProductsCategory = createTreeHelper.tree(productsCategory);
  res.locals.layoutproductsCategory = newProductsCategory;
  next();
};
