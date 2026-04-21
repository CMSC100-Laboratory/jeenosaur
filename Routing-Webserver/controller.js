const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/FARM-TO-TABLE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected');
    await addAdmin();
  })
  .catch((err) => console.log('MongoDB connection error: ', err));


// User Model
const User = mongoose.model('users', {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false }, // optional
    lastName: { type: String, required: true },
    userType: { type: String, required: true }, // Customer or Admin
    email: { type: String, required: true },
    password: { type: String, required: true },
});

// Product Model
const Product = mongoose.model('products', {
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productType: { type: Number, required: true }, // 1 = Crop, 2 = Poultry
    productQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

// Order Transaction Model
const Order = mongoose.model('orders', {
  transactionId: { type: String, required: true },
  productId: { type: String, required: true }, // id reference to product
  orderQuantity: { type: Number, required: true },
  orderStatus: { type: Number, default: 0, required: true }, // 0 = Pending, 1 = Completed, 2 = Cancelled
  email: { type: String, required: true }, // id reference to user
  dateOrdered: { type: Date, default: Date.now, required: true },
  time: { type: String, required: true }
});



// --------------- POST --------------

// Add a new user
exports.addUser = async (req, res, next) => {
  // Checks for missing fields
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    res.send({ success: false, message: "Missing required fields" });
  }

  // Checks for email validity
  const emailRegex = /^\S+@\S+\.\S+$/; // abc@def.ghi
  if (!emailRegex.test(req.body.email)) {
    res.send({ success: false, message: "Invalid email format" });
  }

  // Checks for password length (at least 6 characters)
  if (req.body.password.length < 6) {
    res.send({ success: false, message: "Password must be at least 6 characters long" });
  }

  // Checks for duplicate email
  let hasDuplicateEmail = await User.findOne({ email: req.body.email });

  // If there is no duplicate email
  if(hasDuplicateEmail == null){
    // Create a new user instance
    const newUser = new User({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      userType: 'Customer', // Default user type
      email: req.body.email,
      password: req.body.password,
    });

    // Saves the user to the database successfully
    await newUser.save();
    
    res.send({ success: true, message: "User added successfully" });
  
  // If there is a duplicate email
  } else { 
    res.send({ success: false, message: "Email already exists" });
  }
};

exports.loginUser = async (req, res, next) => {
  // Checks for missing fields
  if (!req.body.email || !req.body.password) {
    res.send({ success: false, message: "Missing required fields" });
  }

  // Find the user by email
  const user = await User.findOne({ email: req.body.email });

  // If user is not found or password doesn't match
  if (!user || user.password !== req.body.password) {
    res.send({ success: false, message: "Invalid email or password" });
  
  // If login is successful
  } else {
    res.send({ success: true, message: "Login successful" });
    return user; // returns the user 
  }
};

// Checks if the user is an admin
function isAdmin (type) {
  return type === 'Admin';
};



// --------------- GET --------------

// Find all users
exports.findAllUsers = async (req, res, next) => {
  // Find the current logged user
  const requester = await User.findById(req.headers['x-user-id']);

  // Checks if the user is an admin
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  const users = await User.find();
  res.send({ total: users.length, users: users });
}

// Find user by ID
exports.findByUserId = async (req, res, next) => {
  // Find the current logged user
  const requester = await User.findById(req.headers['x-user-id']);

  // Checks if the user is an admin
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  // Checks if id is provided
  if (!req.query.id) { return res.send('No id provided') }

  const user = await User.findOne({ _id: req.query.id });
  res.send(user);
}



// --------------- DELETE --------------

// Delete a user by ID
exports.deleteByUserId = async (req, res, next) => {
  // Find the current logged user
  const requester = await User.findById(req.headers['x-user-id']);

  // Checks if the user is an admin
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  const user = await User.findOneAndDelete({ _id: req.body.id });

  if (isAdmin(user.userType)) {
    // Checks if the id to be deleted is an admin
    res.send('Unable to delete an admin user')
  } else if (user) {
    res.send('Successfully deleted ' + user.firstName + ' ' + user.lastName)
  } else {
    res.send('Unable to delete user')
  }
};




// --------------- ADD ADMIN --------------
const addAdmin = async () => {
  const existing = await User.findOne({ email: 'admin@da.gov.ph' });
  if (!existing) {
    const admin = new User({
      firstName: 'Department',
      middleName: 'of',
      lastName: 'Agriculture',
      userType: 'Admin',
      email: 'admin@da.gov.ph',
      password: 'admin123',
    });
    await admin.save();
    console.log('Admin account created');
  }
};

// --------------- PRODUCTS --------------

// Add a new product (Admin only)
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

// Get all products with optional sorting (Public/Customer)
exports.getAllProducts = async (req, res, next) => {
    const sortField = req.query.sortBy || 'productName'; // name, productType, price, productQuantity
    const sortOrder = req.query.order === 'desc' ? -1 : 1; // asc by default

    const products = await Product.find().sort({ [sortField]: sortOrder });
    res.send(products);
};

// Get a single product by ID (Public/Customer)
exports.getProductById = async (req, res, next) => {
    if (!req.query.id) { return res.send({ success: false, message: 'No product ID provided' }); }

    const product = await Product.findById(req.query.id);
    if (!product) { return res.send({ success: false, message: 'Product not found' }); }

    res.send(product);
};

// Update a product (Admin only)
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

// Delete a product (Admin only)
exports.deleteProduct = async (req, res, next) => {
    const requester = await User.findById(req.headers['x-user-id']);
    if (!requester || !isAdmin(requester.userType)) { return res.send({ success: false, message: 'Unauthorized' }); }

    if (!req.body.id) { return res.send({ success: false, message: 'No product ID provided' }); }

    const deleted = await Product.findByIdAndDelete(req.body.id);
    if (!deleted) { return res.send({ success: false, message: 'Product not found' }); }

    res.send({ success: true, message: 'Product deleted: ' + deleted.productName });
};