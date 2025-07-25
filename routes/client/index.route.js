const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");

//module.exports => require(import)
module.exports = (app) => {
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
};
