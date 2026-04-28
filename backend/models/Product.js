const mongoose = require('mongoose')

const Product = mongoose.model('products', {
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  productType: { type: Number, required: true }, // 1 = Crop, 2 = Poultry
  productQuantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

module.exports = Product;
