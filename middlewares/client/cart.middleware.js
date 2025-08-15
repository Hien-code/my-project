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
  }

  next();
};
