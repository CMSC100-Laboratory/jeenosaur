const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const cartController = require('../controllers/cartController')

module.exports = (app) => {

  // Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id, Origin, Accept, X-Requested-With');
    next();
  })

  // User routes
  app.post('/sign-up', userController.addUser)
  app.post('/login', userController.loginUser)
  app.get('/find-all-users', userController.findAllUsers)
  app.get('/find-by-user-id/', userController.findByUserId)
  app.post('/delete-by-user-id', userController.deleteByUserId)

  // Product routes
  app.post('/add-product', productController.addProduct)
  app.get('/get-all-products', productController.getAllProducts)
  app.get('/get-product-by-id', productController.getProductById)
  app.post('/update-product', productController.updateProduct)
  app.post('/delete-product', productController.deleteProduct)

  // Order routes (Admin)
  app.get('/get-all-orders', orderController.getAllOrders)
  app.post('/confirm-order', orderController.confirmOrder)
  app.get('/get-sales-report', orderController.getSalesReport)

  // Order routes (Customer)
  app.post('/create-order', orderController.createOrder)
  app.post('/cancel-order', orderController.cancelOrder)
  app.get('/get-my-orders', orderController.getMyOrders)

  // Cart routes (Customer)
  app.post('/add-to-cart', cartController.addToCart)
  app.get('/get-cart', cartController.getCart)
  app.post('/remove-from-cart', cartController.removeFromCart)

  //Update cart item quantity
  app.post('/update-cart-item', cartController.updateCartItem);
}