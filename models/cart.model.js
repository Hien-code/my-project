const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: String,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);
//Create model mongoose.model(<modelName>, <schema>, <collectionName>);
const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
