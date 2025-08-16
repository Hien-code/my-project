const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");

//[GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      }).select("title thumbnail slug price discountPercentage");

      // Tạo ra field giá mới cho object product
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      // Tạo ra field productInfo cho object cart
      item.productInfo = productInfo;
      // Thêm field giá mới cho object cart
      item.totalPrice = productInfo.priceNew * item.quantity;
    }
  }

  // Thêm field tính tổng của cart reduce: lặp với sum = 0
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/checkout/index", {
    pageTitle: "Trang thanh toán",
    cartDetail: cart,
  });
};

//[post] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({
    _id: cartId,
  });

  const products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  const order = new Order(orderInfo);
  await order.save();

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );

  res.redirect(`/checkout/success/${order.id}`);
};

//[post] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  console.log(req.params.orderId);

  res.render("client/pages/checkout/success");
};
