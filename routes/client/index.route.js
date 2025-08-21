const homeRoutes = require('./home.route')
const productRoutes = require('./product.route')
const searchRoutes = require('./search.route')
const cartRoutes = require('./cart.route')
const checkoutRoutes = require('./checkout.route')
const usertRoutes = require('./user.route')

const categoryMiddleware = require('../../middlewares/client/category.middleware')
const cartMiddleware = require('../../middlewares/client/cart.middleware')
const userMiddleware = require('../../middlewares/client/user.middleware')

//module.exports => require(import)
module.exports = (app) => {
  // app luôn luôn gọi middleware
  app.use(categoryMiddleware.category)
  app.use(cartMiddleware.cart)
  app.use(userMiddleware.infoUser)

  app.use('/', homeRoutes)
  app.use('/products', productRoutes)
  app.use('/search', searchRoutes)
  app.use('/cart', cartRoutes)
  app.use('/checkout', checkoutRoutes)
  app.use('/user', usertRoutes)
}
