// const Cart = require("../../models/cart.model");
// module.exports.cart = async (req, res, next) => {
//   if (!req.cookies.cartId) {
//     const cart = new Cart();
//     await cart.save();
//     //Thời gian cookie tồn tại
//     const expiresCookie = 365 * 24 * 60 * 60 * 1000;

//     //Tạo cookie cartID
//     res.cookie("cartId", cart.id, {
//       expires: new Date(Date.now() + expiresCookie),
//     });
//   } else {
//     const cart = await Cart.findOne({ _id: req.cookies.cartId });

//     // Tổng số sản phẩm
//     cart.totalQuantity = cart.products.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     );
//     res.locals.minicart = cart;
//   }

//   next();
// };

const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
  if (!req.cookies.cartId) {
    // Nếu chưa có cookie => tạo giỏ hàng mới
    const cart = new Cart({ products: [] }); // đảm bảo products là array
    await cart.save();

    // Thời gian cookie tồn tại (1 năm)
    const expiresCookie = 365 * 24 * 60 * 60 * 1000;

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie),
    });

    res.locals.minicart = cart; // để view vẫn có minicart
  } else {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });

    if (cart) {
      // Nếu tìm thấy giỏ hàng trong DB
      cart.totalQuantity = cart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      res.locals.minicart = cart;
    } else {
      // Nếu cookie có nhưng DB không còn giỏ => tạo lại
      const newCart = new Cart({ products: [] });
      await newCart.save();

      res.cookie("cartId", newCart.id, {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });

      res.locals.minicart = newCart;
    }
  }

  next();
};
