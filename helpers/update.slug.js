const mongoose = require("mongoose");
const Product = require("../models/product.model");

async function updateSlugs() {
  await mongoose.connect("mongodb://localhost:27017/products");

  const products = await Product.find({
    slug: { $exists: false },
  });

  for (const product of products) {
    try {
      product.markModified("title"); // Quan trọng!
      await product.save();
      console.log(`Updated slug for: ${product.title}`);
    } catch (err) {
      console.error(`Failed to update slug for: ${product.title}`, err.message);
    }
  }

  console.log("🎉 Slug update complete.");
  process.exit();
}

updateSlugs();
