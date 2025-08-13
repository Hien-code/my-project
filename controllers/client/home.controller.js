const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

//[GET] /
module.exports.index = async (req, res) => {
  // Sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    status: "active",
    delete: false,
  }).limit(6);
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

  // Sản phẩm mới
  const productsNew = await Product.find({
    delete: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);
  const newProductsNew = productsHelper.priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
