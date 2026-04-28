const User = require('../models/User')
const Product = require('../models/Product')

const isAdmin = (type) => type === 'Admin';

// POST /add-product (Admin)
exports.addProduct = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send({ success: false, message: 'Unauthorized' }); }

  if (!req.body.productName || !req.body.productDescription || !req.body.productType ||
    req.body.productQuantity == null || req.body.price == null) {
    return res.send({ success: false, message: 'Missing required fields' });
  }

  if (![1, 2].includes(req.body.productType)) {
    return res.send({ success: false, message: 'Invalid product type. Use 1 for Crop, 2 for Poultry' });
  }

  const newProduct = new Product({
    productName: req.body.productName,
    productDescription: req.body.productDescription,
    productType: req.body.productType,
    productQuantity: req.body.productQuantity,
    price: req.body.price,
  });

  await newProduct.save();
  res.send({ success: true, message: 'Product added successfully' });
};

// GET /get-all-products (Public)
exports.getAllProducts = async (req, res, next) => {
  const sortField = req.query.sortBy || 'productName';
  const sortOrder = req.query.order === 'desc' ? -1 : 1;

  const products = await Product.find().sort({ [sortField]: sortOrder });
  res.send(products);
};

// GET /get-product-by-id (Public)
exports.getProductById = async (req, res, next) => {
  if (!req.query.id) { return res.send({ success: false, message: 'No product ID provided' }); }

  const product = await Product.findById(req.query.id);
  if (!product) { return res.send({ success: false, message: 'Product not found' }); }

  res.send(product);
};

// POST /update-product (Admin)
exports.updateProduct = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send({ success: false, message: 'Unauthorized' }); }

  if (!req.body.id) { return res.send({ success: false, message: 'No product ID provided' }); }

  if (req.body.productType && ![1, 2].includes(req.body.productType)) {
    return res.send({ success: false, message: 'Invalid product type. Use 1 for Crop, 2 for Poultry' });
  }

  const updated = await Product.findByIdAndUpdate(req.body.id, {
    ...(req.body.productName && { productName: req.body.productName }),
    ...(req.body.productDescription && { productDescription: req.body.productDescription }),
    ...(req.body.productType && { productType: req.body.productType }),
    ...(req.body.productQuantity != null && { productQuantity: req.body.productQuantity }),
    ...(req.body.price != null && { price: req.body.price }),
  }, { new: true });

  if (!updated) { return res.send({ success: false, message: 'Product not found' }); }
  res.send({ success: true, message: 'Product updated successfully', product: updated });
};

// POST /delete-product (Admin)
exports.deleteProduct = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send({ success: false, message: 'Unauthorized' }); }

  if (!req.body.id) { return res.send({ success: false, message: 'No product ID provided' }); }

  const deleted = await Product.findByIdAndDelete(req.body.id);
  if (!deleted) { return res.send({ success: false, message: 'Product not found' }); }

  res.send({ success: true, message: 'Product deleted: ' + deleted.productName });
};
