const User = require('../models/User')
const Product = require('../models/Product')
const Cart = require('../models/Cart')

// POST /add-to-cart (Customer)
exports.addToCart = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || requester.userType !== 'Customer') { 
    return res.send({ success: false, message: 'Unauthorized' }); 
  }

  if (!req.body.productId || !req.body.quantity) {
    return res.send({ success: false, message: 'Missing product ID or quantity' });
  }

  //check if item already exists in the user's cart
  let cartItem = await Cart.findOne({ email: requester.email, productId: req.body.productId });

  if (cartItem) {
    //if it exists, just update the quantity
    cartItem.quantity += req.body.quantity;
    await cartItem.save();
  } else {
    //otherwise, create a new cart entry
    cartItem = new Cart({
      email: requester.email,
      productId: req.body.productId,
      quantity: req.body.quantity
    });
    await cartItem.save();
  }

  res.send({ success: true, message: 'Added to cart successfully' });
};

// GET /get-cart (Customer)
exports.getCart = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || requester.userType !== 'Customer') { 
    return res.send({ success: false, message: 'Unauthorized' }); 
  }

  const cartItems = await Cart.find({ email: requester.email });
  
  let totalItems = 0;
  let totalPrice = 0;
  let detailedCart = [];

  for (let item of cartItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      totalItems += item.quantity;
      totalPrice += (product.price * item.quantity);
      detailedCart.push({ 
        cartItemId: item._id, 
        product, 
        quantity: item.quantity 
      });
    }
  }

  res.send({ success: true, cart: detailedCart, totalItems, totalPrice });
};

// POST /remove-from-cart (Customer)
exports.removeFromCart = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || requester.userType !== 'Customer') { 
    return res.send({ success: false, message: 'Unauthorized' }); 
  }

  if (!req.body.cartItemId) {
    return res.send({ success: false, message: 'Missing cart item ID' });
  }

  const deleted = await Cart.findOneAndDelete({ _id: req.body.cartItemId, email: requester.email });
  
  if (!deleted) { return res.send({ success: false, message: 'Cart item not found' }); }

  res.send({ success: true, message: 'Item removed from cart' });
};