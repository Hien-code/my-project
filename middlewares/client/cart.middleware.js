const Cart = require("../../models/cart.model");
module.exports.cart = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    //Thời gian cookie tồn tại
    const expiresCookie = 365 * 24 * 60 * 60 * 1000;

    //Tạo cookie cartID
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie),
    });
  } else {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });

    // Tổng số sản phẩm
    cart.totalQuantity = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    res.locals.minicart = cart;
  }

  next();
};
