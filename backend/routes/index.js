const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const cartController = require('../controllers/cartController')
const User = require('../models/User')



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
  app.post('/disapprove-order', orderController.disapproveOrder)
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

  //Update User Profile Route
  app.post('/update-profile', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      const { firstName, lastName, email, phone, address } = req.body;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          firstName,
          lastName,
          email,
          phone,
          address
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Profile updated successfully',
        user: updatedUser 
      });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Server error: ' + err.message 
      });
    }
  });
}
