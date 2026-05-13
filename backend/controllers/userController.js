const User = require('../models/User')

const isAdmin = (type) => type === 'Admin';

// POST /sign-up
exports.addUser = async (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    return res.send({ success: false, message: "Missing required fields" });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.send({ success: false, message: "Invalid email format" });
  }

  if (req.body.password.length < 6) {
    return res.send({ success: false, message: "Password must be at least 6 characters long" });
  }

  let hasDuplicateEmail = await User.findOne({ email: req.body.email });

  if (hasDuplicateEmail == null) {
    const newUser = new User({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      userType: 'Customer',
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();
    res.send({ success: true, message: "User added successfully" });
  } else {
    res.send({ success: false, message: "Email already exists" });
  }
};

// POST /login
exports.loginUser = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ success: false, message: "Missing required fields" });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user || user.password !== req.body.password) {
    return res.send({ success: false, message: "Invalid email or password" });
  } else {
    res.send({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address
      }
    });
  }
};

// GET /find-all-users (Admin)
exports.findAllUsers = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId || userId === 'undefined') {
    return res.status(401).send({ success: false, message: 'Unauthorized: Missing credentials' });
  }

  const requester = await User.findById(userId);
  if (!requester || !isAdmin(requester.userType)) {
    return res.status(401).send({ success: false, message: 'Unauthorized: User not found' });
  }
  
  const users = await User.find();
  return res.send({ total: users.length, users: users });
};

// GET /find-by-user-id (Admin)
exports.findByUserId = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId || userId === 'undefined') {
    return res.status(401).send({ success: false, message: 'Unauthorized: Missing credentials' });
  }

  const requester = await User.findById(userId);
  if (!requester || !isAdmin(requester.userType)) {
    return res.status(401).send({ success: false, message: 'Unauthorized: User not found' });
  }

  if (!req.query.id) { return res.send({ success: false, message: 'No id provided' }); }

  const user = await User.findOne({ _id: req.query.id });
  res.send(user);
};

// POST /delete-by-user-id (Admin)
exports.deleteByUserId = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId || userId === 'undefined') {
    return res.status(401).send({ success: false, message: 'Unauthorized: Missing credentials' });
  }

  const requester = await User.findById(userId);
  if (!requester || !isAdmin(requester.userType)) {
    return res.status(401).send({ success: false, message: 'Unauthorized: User not found' });
  }
  
  const user = await User.findById(req.body.id);
  if (!user) { return res.send({ success: false, message: 'Unable to delete user' }); }
  if (isAdmin(user.userType)) {
    return res.send({ success: false, message: 'Unable to delete an admin user' });
  }

  await User.findByIdAndDelete(req.body.id);
  res.send({ success: true, message: 'Successfully deleted ' + user.firstName + ' ' + user.lastName });
};

// POST /update-profile (Customer)
exports.updateProfile = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId || userId === 'undefined') {
    return res.status(401).send({ success: false, message: 'Unauthorized: Missing credentials' });
  }

  const user = await User.findById(userId);
  if (!user || user.userType !== 'Customer') {
    return res.status(401).send({ success: false, message: 'Unauthorized: User not found' });
  }

  if (!req.body.firstName || !req.body.lastName || !req.body.email) {
    return res.send({ success: false, message: 'First name, last name, and email are required' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.send({ success: false, message: 'Invalid email format' });
  }

  const duplicate = await User.findOne({ email: req.body.email, _id: { $ne: userId } });
  if (duplicate) {
    return res.send({ success: false, message: 'Email already exists' });
  }

  user.firstName = req.body.firstName;
  user.middleName = req.body.middleName || '';
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.phone = req.body.phone || '';
  user.address = req.body.address || '';

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.send({ success: false, message: 'Password must be at least 6 characters long' });
    }
    user.password = req.body.password;
  }

  await user.save();
  res.send({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      phone: user.phone,
      address: user.address
    }
  });
};
