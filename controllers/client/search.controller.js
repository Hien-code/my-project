const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

//[GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  if (keyword) {
    const regex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: regex,
      delete: false,
      status: "active",
    });
    newProducts = productsHelper.priceNewProducts(products);
  }

  res.render("client/pages/search/index", {
    keyword: keyword,
    products: newProducts,
  });
};
