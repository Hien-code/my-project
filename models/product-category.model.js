const mongoose = require("mongoose");

//Thêm slug
const slug = require("mongoose-slug-updater");
const { type } = require("os");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: "",
    },
    description: String,
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
const ProductCategogy = mongoose.model(
  "ProductCategogy",
  productCategorySchema,
  "products-category"
);

module.exports = ProductCategogy;
