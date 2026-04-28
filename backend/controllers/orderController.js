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
    const income = (product ? product.price : 0) * order.orderQuantity;

    if (!reportMap[order.productId]) {
      reportMap[order.productId] = {
        productId: order.productId,
        productName,
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
