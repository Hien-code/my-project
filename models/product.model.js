const mongoose = require("mongoose");

//Thêm slug
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//Create model mongoose.model(<modelName>, <schema>, <collectionName>);
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
