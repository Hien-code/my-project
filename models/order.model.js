const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart_id: String,
    userInfor: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      },
    ],
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
//Create model mongoose.model(<modelName>, <schema>, <collectionName>);
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
