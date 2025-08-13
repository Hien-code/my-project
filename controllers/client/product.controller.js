//[GET] /products
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    delete: false,
  }).sort({ position: -1 });

  const newProduct = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang products",
    //products: this variable is accessed in the Pug template
    products: newProduct,
  });
};

//[GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      delete: false,
      slug: req.params.slug,
      status: "active",
    };
    const product = await Product.findOne(find);
    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
