const mongoose = require('mongoose')

const Cart = mongoose.model('carts', {
  email: { type: String, required: true }, //links the cart item to the customer
  productId: { type: String, required: true },
  quantity: { type: Number, required: true }
});

module.exports = Cart;