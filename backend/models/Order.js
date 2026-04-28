const mongoose = require('mongoose')

const Order = mongoose.model('orders', {
  transactionId: { type: String, required: true },
  productId: { type: String, required: true },
  orderQuantity: { type: Number, required: true },
  orderStatus: { type: Number, default: 0, required: true }, // 0 = Pending, 1 = Completed, 2 = Cancelled
  email: { type: String, required: true },
  dateOrdered: { type: Date, default: Date.now, required: true },
  time: { type: String, required: true },
});

module.exports = Order;
