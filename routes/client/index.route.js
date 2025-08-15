const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

//module.exports => require(import)
module.exports = (app) => {
  // app luôn luôn gọi middleware
  app.use(categoryMiddleware.category);
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
};
