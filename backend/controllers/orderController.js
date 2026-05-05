const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')

const isAdmin = (type) => type === 'Admin';

// GET /get-all-orders (Admin)
// Returns all orders, optionally filtered by status (?status=0|1|2)
exports.getAllOrders = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send({ success: false, message: 'Unauthorized' }); }

  const filter = {};
  if (req.query.status != null) { filter.orderStatus = req.query.status; }

  const orders = await Order.find(filter).sort({ dateOrdered: -1 });
  res.send({ total: orders.length, orders });
};

// POST /confirm-order (Admin)
// Sets order status to 1 (Completed) and decrements product quantity
exports.confirmOrder = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send({ success: false, message: 'Unauthorized' }); }

  if (!req.body.transactionId) { return res.send({ success: false, message: 'No transaction ID provided' }); }

  const order = await Order.findOne({ transactionId: req.body.transactionId });
  if (!order) { return res.send({ success: false, message: 'Order not found' }); }
  if (order.orderStatus !== 0) { return res.send({ success: false, message: 'Order is not pending' }); }

  const product = await Product.findById(order.productId);
  if (!product) { return res.send({ success: false, message: 'Associated product not found' }); }
  if (product.productQuantity < order.orderQuantity) { return res.send({ success: false, message: 'Insufficient product quantity' }); }

  await Product.findByIdAndUpdate(order.productId, {
    $inc: { productQuantity: -order.orderQuantity }
  });

  order.orderStatus = 1;
  await order.save();

  res.send({ success: true, message: 'Order confirmed and inventory updated' });
};

// GET /get-sales-report (Admin)
// Query params: period = 'weekly' | 'monthly' | 'annual'
exports.getSalesReport = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send({ success: false, message: 'Unauthorized' }); }

  const period = req.query.period || 'annual';
  const now = new Date();
  let startDate;

  if (period === 'weekly') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
  } else if (period === 'monthly') {
    startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 1);
  } else {
    // annual
    startDate = new Date(now);
    startDate.setFullYear(now.getFullYear() - 1);
  }

  const completedOrders = await Order.find({
    orderStatus: 1,
    dateOrdered: { $gte: startDate }
  });

  // Group by productId and compute per-product totals
  const reportMap = {};
  for (const order of completedOrders) {
    const product = await Product.findById(order.productId);
    const productName = product ? product.productName : 'Unknown Product';
    const productType = product ? product.productType : null;
    const income = (product ? product.price : 0) * order.orderQuantity;

    if (!reportMap[order.productId]) {
      reportMap[order.productId] = {
        productId: order.productId,
        productName,
        productType,
        totalQuantitySold: 0,
        totalIncome: 0,
      };
    }

    reportMap[order.productId].totalQuantitySold += order.orderQuantity;
    reportMap[order.productId].totalIncome += income;
  }

  const report = Object.values(reportMap);
  const totalSales = report.reduce((sum, item) => sum + item.totalIncome, 0);

  res.send({ period, startDate, report, totalSales });
};

// POST /create-order (Customer)
// FIXED: Changed second 'req' to 'res'
exports.createOrder = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if(!requester || requester.userType !== 'Customer'){
    return res.send({ success: false, message: 'Unauthorized' });
  }

  if(!req.body.productId || !req.body.orderQuantity){
    return res.send({ success: false, message: 'Missing product ID or quantity' });
  }

  //generate random transaction id
  const transactionId = 'TRX-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

  const now = new Date();
  const timeString = now.toLocaleTimeString(); //format to readable time string

  const newOrder = new Order({
    transactionId: transactionId,
    productId: req.body.productId,
    orderQuantity: req.body.orderQuantity,
    orderStatus: 0, //pending
    email: requester.email,
    dateOrdered: now,
    time: timeString
  });

  await newOrder.save();
  res.send({ success: true, message: 'Order created successfully', transactionId });
};

// POST /cancel-order (Customer)
exports.cancelOrder = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || requester.userType !== 'Customer') { 
    return res.send({ success: false, message: 'Unauthorized' }); 
  }

  if (!req.body.transactionId) { 
    return res.send({ success: false, message: 'No transaction ID provided' }); 
  }

  //find the order and verify it belongs to the logged-in customer
  const order = await Order.findOne({ 
    transactionId: req.body.transactionId, 
    email: requester.email 
  });
  
  if (!order) { return res.send({ success: false, message: 'Order not found' }); }

  if (order.orderStatus !== 0) { 
    return res.send({ success: false, message: 'Only pending orders can be canceled' }); 
  }

  order.orderStatus = 2; // 2 = Canceled
  await order.save();
  
  res.send({ success: true, message: 'Order canceled successfully' });
};

// GET /get-my-orders (Customer)
exports.getMyOrders = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || requester.userType !== 'Customer') { 
    return res.send({ success: false, message: 'Unauthorized' }); 
  }

  const orders = await Order.find({ email: requester.email }).sort({ dateOrdered: -1 });
  res.send({ total: orders.length, orders });
};